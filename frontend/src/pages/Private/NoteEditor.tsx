import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { showToast } from "@/utils/toastUtils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounceCallback } from "@/utils/debounce";
import { useAppDispatch, useAppSelector } from "@/store";
import { createNote, updateNote, fetchNoteById, setCurrentNote, deleteNote, archiveNote } from "@/store/slices/notesSlice";
import { ActionDropdown } from "@/components/action-dropdown";
import { ActionIcons } from "@/utils/action-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomAlertDialog } from "@/components/custom-alert-dialog";
import { ShareNoteDialog } from "@/components/share-note-dialog";
import { useTheme } from "@/components/theme-provider";

export default function NoteEditor() {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { theme } = useTheme();
    const { id: routeId } = useParams();
    const id = routeId || "new";
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.auth.token);

    const { currentNote, items: allNotes } = useAppSelector((state) => state.notes);

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [savingStatus, setSavingStatus] = useState<"saved" | "saving" | "error">("saved");

    const editor = useCreateBlockNote();

    const handleDelete = async () => {
        try {
            await dispatch(deleteNote(id)).unwrap();
            showToast.success("Note deleted");
            navigate("/dashboard");
        } catch {
            showToast.error("Failed to delete note");
        }
    };

    const handleArchive = useCallback(async () => {
        if (id === "new") return;
        const archived = !currentNote?.isArchived;
        try {
            await dispatch(archiveNote({ id, archived })).unwrap();
            showToast.success(archived ? "Note archived" : "Note restored");
            if (archived) navigate("/dashboard");
        } catch {
            showToast.error("Could not update note");
        }
    }, [id, currentNote?.isArchived, dispatch, navigate]);

    const titleRef = useRef(title);
    const idRef = useRef(id);
    const savingRef = useRef(savingStatus);
    const isInitializingRef = useRef(false);
    const lastLoadedIdRef = useRef<string | null>(null);

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        idRef.current = id;
    }, [id]);

    useEffect(() => {
        savingRef.current = savingStatus;
    }, [savingStatus]);

    const saveNoteRedux = useCallback(async (currentId: string, currentTitle: string, currentContent: unknown[]) => {
        if (!currentId) return;

        try {
            if (currentId === "new") {
                const resultAction = await dispatch(createNote({ title: currentTitle, content: currentContent })).unwrap();
                lastLoadedIdRef.current = resultAction._id;
                navigate(`/dashboard/note/${resultAction._id}`, { replace: true });
            } else {
                await dispatch(updateNote({ id: currentId, title: currentTitle, content: currentContent })).unwrap();
            }
            setSavingStatus("saved");
        } catch {
            setSavingStatus("error");
            showToast.error("Failed to auto-save note");
        }
    }, [dispatch, navigate]);

    const debouncedSave = useDebounceCallback(saveNoteRedux, 1500);

    const triggerSave = useCallback((newTitle?: string) => {
        const currentId = idRef.current || "new";
        const currentTitle = newTitle !== undefined ? newTitle : titleRef.current;
        const blocks = editor.document;

        if (isInitializingRef.current) return;

        const isDocEmpty = blocks.length === 1 &&
            blocks[0].type === "paragraph" &&
            (!blocks[0].content || (Array.isArray(blocks[0].content) && blocks[0].content.length === 0));

        if (currentId === "new" && !currentTitle.trim() && isDocEmpty) {
            setSavingStatus("saved");
            return;
        }

        if (savingRef.current !== "saving") {
            setSavingStatus("saving");
        }

        debouncedSave(currentId, currentTitle, blocks);
    }, [debouncedSave, editor]);

    useEffect(() => {
        debouncedSave.cancel();

        if (id && id !== "new") {
            const cachedNote = allNotes.find((n) => n._id === id);

            if (cachedNote) {
                if (currentNote?._id !== id) {
                    dispatch(setCurrentNote(cachedNote));
                }
                setLoading(false);
                return;
            }

            if (currentNote?._id === id) {
                setLoading(false);
                return;
            }

            const loadNote = async () => {
                if (!token) return;

                setLoading(true);
                try {
                    await dispatch(fetchNoteById(id)).unwrap();
                } catch {
                    showToast.error("Note not found");
                    navigate("/dashboard");
                } finally {
                    setLoading(false);
                }
            };
            void loadNote();
        } else {
            isInitializingRef.current = true;
            setLoading(false);
            setTitle("");
            editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);
            dispatch(setCurrentNote(null));
            setSavingStatus("saved");
            lastLoadedIdRef.current = "new";
            setTimeout(() => { isInitializingRef.current = false; }, 100);
        }
    }, [id, dispatch, navigate, editor, debouncedSave, allNotes, currentNote?._id, token]);

    useEffect(() => {
        if (currentNote && currentNote._id === id && lastLoadedIdRef.current !== id) {
            isInitializingRef.current = true;
            setTitle(currentNote.title || "");

            if (currentNote.content && currentNote.content.length > 0) {
                editor.replaceBlocks(editor.document, currentNote.content as never);
            } else {
                editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);
            }

            lastLoadedIdRef.current = id;
            setTimeout(() => { isInitializingRef.current = false; }, 50);
        }
    }, [currentNote, id, editor]);

    const noteActions = useMemo(() => ([
        {
            label: "Share",
            icon: ActionIcons.Share,
            onClick: () => {
                if (id === "new") {
                    showToast.info("Save the note first to share it");
                    return;
                }
                setIsShareOpen(true);
            },
        },
        {
            label: currentNote?.isArchived ? "Restore" : "Archive",
            icon: ActionIcons.Archive,
            onClick: () => void handleArchive(),
        },
        {
            label: "Delete",
            icon: ActionIcons.Delete,
            variant: "destructive" as const,
            onClick: () => setIsDeleteDialogOpen(true),
        },
    ]), [currentNote?.isArchived, id, handleArchive]);

    if (loading) {
        return (
            <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-4 pt-8">
                <Skeleton className="h-12 w-3/4" />
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    const resolvedTheme = theme === "system"
        ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

    const liveNote = allNotes.find((n) => n._id === id) || currentNote;

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {liveNote?.isArchived && (
                <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-3 py-2 text-sm">
                    <span>This note is archived.</span>
                    <Button size="sm" variant="outline" onClick={() => void handleArchive()}>
                        Restore
                    </Button>
                </div>
            )}
            <div className="flex items-center justify-between">
                <Input
                    className="h-auto flex-1 border-none bg-transparent px-0 text-4xl font-bold placeholder:opacity-50 focus-visible:ring-0"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTitle(newTitle);
                        triggerSave(newTitle);
                    }}
                />
                <div className="flex items-center gap-4">
                    <div className="min-w-[80px] text-right text-xs text-muted-foreground">
                        {savingStatus === "saving" && <span className="animate-pulse">Saving...</span>}
                        {savingStatus === "saved" && <span>All changes saved</span>}
                        {savingStatus === "error" && <span className="text-red-500">Save failed</span>}
                    </div>
                    <ActionDropdown actions={noteActions} />
                </div>
            </div>
            <div className="min-h-[500px]">
                <BlockNoteView
                    editor={editor}
                    theme={resolvedTheme as "light" | "dark"}
                    onChange={() => {
                        triggerSave();
                    }}
                    autoFocus
                />
            </div>
            <CustomAlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Note"
                description="Are you sure you want to delete this note? This action cannot be undone."
                action={{
                    text: "Delete",
                    variant: "destructive",
                    onClick: () => void handleDelete(),
                }}
            />
            <ShareNoteDialog
                open={isShareOpen}
                onOpenChange={setIsShareOpen}
                note={liveNote}
            />
        </div>
    );
}
