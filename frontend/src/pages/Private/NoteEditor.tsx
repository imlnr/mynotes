import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import { SidebarWrapper } from "@/components/sidebar-wrapper";
import { showToast } from "@/utils/toastUtils";
import { Input } from "@/components/ui/input";
import { useDebounceCallback } from "@/utils/debounce";
import type { AppDispatch, RootState } from "@/store";
import { createNote, updateNote, fetchNoteById, setCurrentNote } from "@/store/slices/notesSlice";

export default function NoteEditor() {
    const { id: routeId } = useParams();
    const id = routeId || "new";
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // Select note from Redux store
    const currentNote = useSelector((state: RootState) => state.notes.currentNote);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(id !== "new");
    const [savingStatus, setSavingStatus] = useState<"saved" | "saving" | "error">("saved");

    const editor = useCreateBlockNote();

    // Refs to keep track of the latest state for the debounced save function
    const titleRef = useRef(title);
    const idRef = useRef(id);

    useEffect(() => {
        titleRef.current = title;
    }, [title]);

    useEffect(() => {
        idRef.current = id;
    }, [id]);

    // Redux-based Save Function
    const saveNoteRedux = useCallback(async (currentId: string, currentTitle: string, currentContent: any[]) => {
        if (!currentId) return;

        setSavingStatus("saving");

        try {
            console.log(`[NoteEditor] Redux Save: ${currentId}`, { title: currentTitle });
            if (currentId === "new") {
                const resultAction = await dispatch(createNote({ title: currentTitle, content: currentContent })).unwrap();
                console.log("[NoteEditor] Note created:", resultAction._id);
                // Redirect to the newly created note's actual ID
                navigate(`/dashboard/note/${resultAction._id}`, { replace: true });
            } else {
                await dispatch(updateNote({ id: currentId, title: currentTitle, content: currentContent })).unwrap();
                console.log("[NoteEditor] Note updated");
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
        setSavingStatus("saving");
        const blocks = editor.document;
        const currentTitle = newTitle !== undefined ? newTitle : titleRef.current;
        const currentId = idRef.current || "new";

        if (currentId === "new" && !currentTitle && blocks.length === 1 && blocks[0].content === undefined) {
            setSavingStatus("saved");
            return;
        }

        debouncedSave(currentId, currentTitle, blocks);
    }, [debouncedSave, editor]);

    // Update local title when Redux note changes (initial load or navigation)
    useEffect(() => {
        if (currentNote && currentNote._id === id) {
            setTitle(currentNote.title || "");
            if (currentNote.content && currentNote.content.length > 0) {
                // Only replace if editor is empty or actually different to avoid input lag
                // However, replaceBlocks is usually safe since we only do it on note switch/load
                editor.replaceBlocks(editor.document, currentNote.content);
            }
        }
    }, [currentNote, id, editor]);

    // Initial load logic
    useEffect(() => {
        if (id && id !== "new") {
            const loadNote = async () => {
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
            setLoading(false);
            setTitle("Untitled");
            // Clear editor content for new notes
            editor.replaceBlocks(editor.document, [{ type: "paragraph", content: [] }]);
            dispatch(setCurrentNote(null)); // Clear current note for "new"
            setSavingStatus("saved");
        }
    }, [id, dispatch, navigate, editor]);

    if (loading) {
        return (
            <SidebarWrapper>
                <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </SidebarWrapper>
        );
    }

    return (
        <SidebarWrapper>
            <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full ">
                <div className="flex items-center justify-between">
                    <Input
                        className="text-4xl font-bold border-none focus-visible:ring-0 px-0 h-auto placeholder:opacity-50 flex-1"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => {
                            const newTitle = e.target.value;
                            setTitle(newTitle);
                            triggerSave(newTitle);
                        }}
                    />
                    <div className="text-xs text-muted-foreground ml-4 min-w-[80px] text-right">
                        {savingStatus === "saving" && <span className="animate-pulse">Saving...</span>}
                        {savingStatus === "saved" && <span>All changes saved</span>}
                        {savingStatus === "error" && <span className="text-red-500">Save failed</span>}
                    </div>
                </div>
                <div className="min-h-[500px]">
                    <BlockNoteView
                        editor={editor}
                        theme="light"
                        onChange={() => {
                            triggerSave();
                        }}
                    />
                </div>
            </div>
        </SidebarWrapper>
    );
}
