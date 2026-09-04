import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/mantine/style.css";
import "@blocknote/core/fonts/inter.css";
import NoteService from "@/utils/noteService";
import type { Note } from "@/types/note";
import { PublicLayout } from "@/components/public-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";
import { formatRelativeTime } from "@/utils/format";

export default function SharedNote() {
    const { shareId } = useParams();
    const { theme } = useTheme();
    const editor = useCreateBlockNote();
    const [note, setNote] = useState<Note | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

    useEffect(() => {
        if (!shareId) return;

        let cancelled = false;

        const load = async () => {
            try {
                const response = await NoteService.getSharedNote(shareId);
                if (cancelled) return;
                const shared = response.data.note;
                setNote(shared);
                const content = Array.isArray(shared.content) ? shared.content : [];
                if (content.length > 0) {
                    editor.replaceBlocks(editor.document, content as never);
                }
                setStatus("ready");
            } catch {
                if (!cancelled) setStatus("error");
            }
        };

        void load();
        return () => {
            cancelled = true;
        };
    }, [shareId, editor]);

    const resolvedTheme = theme === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;

    if (status === "loading") {
        return (
            <PublicLayout>
                <div className="mx-auto w-full max-w-3xl px-4 py-12">
                    <Skeleton className="h-10 w-2/3" />
                    <div className="mt-6 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            </PublicLayout>
        );
    }

    if (!shareId || status === "error" || !note) {
        return (
            <PublicLayout>
                <div className="mx-auto max-w-lg px-4 py-24 text-center">
                    <h1 className="text-2xl font-bold">This note is not available</h1>
                    <p className="mt-2 text-muted-foreground">
                        It may be unpublished, deleted, or the link is incorrect.
                    </p>
                    <Link to="/" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
                        Back to Docables
                    </Link>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <article className="mx-auto w-full max-w-3xl px-4 py-12">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Shared note</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight">{note.title || "Untitled"}</h1>
                {note.updatedAt && (
                    <p className="mt-2 text-sm text-muted-foreground">
                        Updated {formatRelativeTime(note.updatedAt)}
                    </p>
                )}
                <div className="mt-8 min-h-[320px]">
                    <BlockNoteView
                        editor={editor}
                        theme={resolvedTheme as "light" | "dark"}
                        editable={false}
                    />
                </div>
            </article>
        </PublicLayout>
    );
}
