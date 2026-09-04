import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store";
import { archiveNote, deleteNote } from "@/store/slices/notesSlice";
import { formatRelativeTime } from "@/utils/format";
import { showToast } from "@/utils/toastUtils";
import { ActionDropdown } from "@/components/action-dropdown";
import { ActionIcons } from "@/utils/action-icons";
import { ShareNoteDialog } from "@/components/share-note-dialog";
import { CustomAlertDialog } from "@/components/custom-alert-dialog";
import type { Note } from "@/types/note";

export default function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { items: notes, status } = useAppSelector((state) => state.notes);
    const [query, setQuery] = useState("");
    const [showArchived, setShowArchived] = useState(false);
    const [shareNote, setShareNote] = useState<Note | null>(null);
    const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

    const visibleNotes = useMemo(() => {
        const needle = query.trim().toLowerCase();
        return notes.filter((note) => {
            const archived = Boolean(note.isArchived);
            if (showArchived !== archived) return false;
            if (!needle) return true;
            return (note.title || "untitled").toLowerCase().includes(needle);
        });
    }, [notes, query, showArchived]);

    const loading = status === "loading" && notes.length === 0;

    const handleArchive = async (note: Note) => {
        try {
            await dispatch(archiveNote({ id: note._id, archived: !note.isArchived })).unwrap();
            showToast.success(note.isArchived ? "Note restored" : "Note archived");
        } catch {
            showToast.error("Could not update note");
        }
    };

    const confirmDelete = async () => {
        if (!noteToDelete) return;
        try {
            await dispatch(deleteNote(noteToDelete)).unwrap();
            showToast.success("Note deleted");
        } catch {
            showToast.error("Failed to delete note");
        } finally {
            setNoteToDelete(null);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Your notes</h1>
                    <p className="text-sm text-muted-foreground">
                        {showArchived ? "Archived notes" : "Recent documents"}
                    </p>
                </div>
                <Button onClick={() => navigate("/dashboard/note/new")}>
                    <PlusIcon className="size-4" />
                    New note
                </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search notes"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={!showArchived ? "default" : "outline"}
                        onClick={() => setShowArchived(false)}
                    >
                        Active
                    </Button>
                    <Button
                        variant={showArchived ? "default" : "outline"}
                        onClick={() => setShowArchived(true)}
                    >
                        Archived
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-36 w-full rounded-xl" />
                    ))}
                </div>
            ) : visibleNotes.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                        <p className="font-medium">
                            {showArchived ? "No archived notes" : "No notes yet"}
                        </p>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            {showArchived
                                ? "Archived notes will show up here."
                                : "Create a note to start writing. It saves automatically."}
                        </p>
                        {!showArchived && (
                            <Button onClick={() => navigate("/dashboard/note/new")}>
                                Create your first note
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleNotes.map((note) => (
                        <Card
                            key={note._id}
                            className="group cursor-pointer transition-colors hover:border-foreground/20"
                            onClick={() => navigate(`/dashboard/note/${note._id}`)}
                        >
                            <CardContent className="flex h-full flex-col gap-3 p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="line-clamp-2 font-semibold">
                                        {note.title || "Untitled"}
                                    </h2>
                                    <ActionDropdown
                                        actions={[
                                            {
                                                label: "Open",
                                                icon: ActionIcons.Open,
                                                onClick: () => navigate(`/dashboard/note/${note._id}`),
                                            },
                                            {
                                                label: "Share",
                                                icon: ActionIcons.Share,
                                                onClick: () => setShareNote(note),
                                            },
                                            {
                                                label: note.isArchived ? "Restore" : "Archive",
                                                icon: ActionIcons.Archive,
                                                onClick: () => void handleArchive(note),
                                            },
                                            {
                                                label: "Delete",
                                                icon: ActionIcons.Delete,
                                                variant: "destructive",
                                                onClick: () => setNoteToDelete(note._id),
                                            },
                                        ]}
                                    />
                                </div>
                                <p className="mt-auto text-xs text-muted-foreground">
                                    {formatRelativeTime(note.updatedAt)}
                                    {note.isPublished ? " · Published" : ""}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ShareNoteDialog
                open={Boolean(shareNote)}
                onOpenChange={(open) => !open && setShareNote(null)}
                note={shareNote ? notes.find((n) => n._id === shareNote._id) || shareNote : null}
            />
            <CustomAlertDialog
                open={Boolean(noteToDelete)}
                onOpenChange={(open) => !open && setNoteToDelete(null)}
                title="Delete note"
                description="This cannot be undone."
                action={{
                    text: "Delete",
                    variant: "destructive",
                    onClick: () => void confirmDelete(),
                }}
            />
        </div>
    );
}
