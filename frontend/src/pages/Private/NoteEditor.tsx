import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { showToast } from "@/utils/toastUtils";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/utils/debounce";
import type { AppDispatch, RootState } from "@/store";
import { createNote, updateNote, fetchNoteById, setCurrentNote, deleteNote } from "@/store/slices/notesSlice";
import { ActionDropdown } from "@/components/action-dropdown";
import { ActionIcons } from "@/utils/action-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";

export default function NoteEditor() {
    const { theme } = useTheme();
    const { id: routeId } = useParams();
    const id = routeId || "new";
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Select note and full list from Redux store for optimistic loading
    const { currentNote, items: allNotes } = useSelector((state: RootState) => state.notes);

    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false); // Initialized later based on cache
    const [savingStatus, setSavingStatus] = useState<"saved" | "saving" | "error">("saved");

    const editor = useCreateBlockNote();

    const noteActions = [
        { label: "Open", icon: ActionIcons.Open, onClick: () => showToast.info("Opening note...") },
        {
            label: "Share", icon: ActionIcons.Share, onClick: () => {
                navigator.clipboard.writeText(window.location.href);
                showToast.info("Link copied to clipboard!");
            }
        },
        { label: "Publish", icon: ActionIcons.Publish, onClick: () => showToast.success("Note published!") },
        {
            label: "Delete",
            icon: ActionIcons.Delete,
            variant: "destructive" as const,
            onClick: async () => {
                if (window.confirm("Are you sure you want to delete this note?")) {
                    try {
                        await dispatch(deleteNote(id)).unwrap();
                        showToast.success("Note deleted");
                        navigate("/dashboard");
                    } catch (err) {
                        showToast.error("Failed to delete note");
                    }
                }
            }
        },
    ];

    // Refs to keep track of the latest state for the debounced save function
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

    // Redux-based Save Function
    const saveNoteRedux = useCallback(async (currentId: string, currentTitle: string, currentContent: any[]) => {
        if (!currentId) return;

        try {
            console.log(`[NoteEditor] API CALL: Saving ${currentId}`);
            if (currentId === "new") {
                const resultAction = await dispatch(createNote({ title: currentTitle, content: currentContent })).unwrap();
                console.log("[NoteEditor] Note created on backend");
                // Navigate but don't set loading state (since we have the note in Redux)
                lastLoadedIdRef.current = resultAction._id;
                navigate(`/dashboard/note/${resultAction._id}`, { replace: true });
            } else {
                await dispatch(updateNote({ id: currentId, title: currentTitle, content: currentContent })).unwrap();
                console.log("[NoteEditor] Note updated on backend");
            }
            setSavingStatus("saved");
        } catch (err: any) {
            console.error("[NoteEditor] Save failed:", err);
            setSavingStatus("error");
            showToast.error("Failed to auto-save note");
        }
    }, [dispatch, navigate]);

    const debouncedSave = useDebounceCallback(saveNoteRedux, 1500);

    const triggerSave = useCallback((newTitle?: string) => {
        const currentId = idRef.current || "new";
        const currentTitle = newTitle !== undefined ? newTitle : titleRef.current;
        const blocks = editor.document;

        // CRITICAL: Block any save during initial setup or if note is empty
        if (isInitializingRef.current) return;

        // Check if the document is essentially empty
        const isDocEmpty = blocks.length === 1 &&
            blocks[0].type === "paragraph" &&
            (!blocks[0].content || (Array.isArray(blocks[0].content) && blocks[0].content.length === 0));

        if (currentId === "new" && !currentTitle.trim() && isDocEmpty) {
            setSavingStatus("saved");
            return;
        }

        // Only show "saving" status if it's not already there
        if (savingRef.current !== "saving") {
            setSavingStatus("saving");
        }

        debouncedSave(currentId, currentTitle, blocks);
    }, [debouncedSave, editor]);

    // OPTIMISTIC LOADING & Initialization
    useEffect(() => {
        debouncedSave.cancel();

        if (id && id !== "new") {
            // 1. Check if note is already in Redux (either as currentNote or in allNotes)
            const cachedNote = allNotes.find(n => n._id === id);

            if (cachedNote) {
                console.log(`[NoteEditor] Cache Hit: Loading ${id} from memory`);
                // If it's already currentNote, we don't even need to dispatch
                if (currentNote?._id !== id) {
                    dispatch(setCurrentNote(cachedNote));
                }
                setLoading(false);
                return;
            }

            // 2. If it is currentNote but not in allNotes (unlikely but possible)
            if (currentNote?._id === id) {
                setLoading(false);
                return;
            }

            // 3. Fallback: Fetch from backend if not found in cache
            const loadNote = async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log("[NoteEditor] Unauthenticated: Skipping fetch");
                    return;
                }

                console.log(`[NoteEditor] Cache Miss: Fetching ${id} from API`);
                setLoading(true);
                try {
                    await dispatch(fetchNoteById(id)).unwrap();
                } catch (err) {
                    showToast.error("Note not found");
                    navigate("/dashboard");
                } finally {
                    setLoading(false);
                }
            };
            loadNote();
        } else {
            // New Note Logic
            console.log("[NoteEditor] Zero-API Mode: Initializing new note");
            isInitializingRef.current = true;
            setLoading(false);
            setTitle("");
            editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);
            dispatch(setCurrentNote(null));
            setSavingStatus("saved");
            lastLoadedIdRef.current = "new";
            setTimeout(() => { isInitializingRef.current = false; }, 100);
        }
    }, [id, dispatch, navigate, editor, debouncedSave, allNotes]); // Included allNotes for cache check

    // Update Local Editor State when currentNote is resolved (from cache or API)
    useEffect(() => {
        // Only update editor blocks if we've actually switched to a DIFFERENT note
        if (currentNote && currentNote._id === id && lastLoadedIdRef.current !== id) {
            console.log(`[NoteEditor] Initializing Content: ${id}`);
            isInitializingRef.current = true;
            setTitle(currentNote.title || "");

            // Set document editor content
            if (currentNote.content && currentNote.content.length > 0) {
                editor.replaceBlocks(editor.document, currentNote.content);
            } else {
                editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);
            }

            lastLoadedIdRef.current = id;
            // Short timeout to ensure editor is ready before allowing triggerSave
            setTimeout(() => { isInitializingRef.current = false; }, 50);
        }
    }, [currentNote, id, editor]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full pt-8 h-full">
                <Skeleton className="h-12 w-3/4" />
                <div className="space-y-4 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        );
    }

    // Resolve theme for BlockNote
    const resolvedTheme = theme === "system"
        ? (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <Input
                    className="text-4xl font-bold border-none focus-visible:ring-0 px-0 h-auto placeholder:opacity-50 flex-1 bg-transparent"
                    placeholder="Note Title"
                    value={title}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        setTitle(newTitle);
                        triggerSave(newTitle);
                    }}
                />
                <div className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground min-w-[80px] text-right">
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
        </div>
    );
}
