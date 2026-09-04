import { useState } from "react";
import { Globe, LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    CustomAlertDialog,
} from "@/components/custom-alert-dialog";
import { showToast } from "@/utils/toastUtils";
import { copyText, getShareUrl } from "@/utils/format";
import { useAppDispatch } from "@/store";
import { updateNote } from "@/store/slices/notesSlice";
import type { Note } from "@/types/note";

interface ShareNoteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    note: Note | null;
}

export function ShareNoteDialog({ open, onOpenChange, note }: ShareNoteDialogProps) {
    const dispatch = useAppDispatch();
    const [busy, setBusy] = useState(false);

    if (!note) return null;

    const shareUrl = note.shareId ? getShareUrl(note.shareId) : "";
    const published = Boolean(note.isPublished && note.shareId);

    const handlePublishToggle = async (next: boolean) => {
        setBusy(true);
        try {
            const updated = await dispatch(updateNote({ id: note._id, isPublished: next })).unwrap();
            if (next && updated.shareId) {
                const url = getShareUrl(updated.shareId);
                await copyText(url);
                showToast.success("Note published", "Public link copied to clipboard");
            } else {
                showToast.info("Note unpublished", "The public link no longer works");
            }
        } catch {
            showToast.error(next ? "Failed to publish note" : "Failed to unpublish note");
        } finally {
            setBusy(false);
        }
    };

    const handleCopy = async () => {
        if (!shareUrl) return;
        try {
            await copyText(shareUrl);
            showToast.success("Link copied");
        } catch {
            showToast.error("Could not copy link");
        }
    };

    return (
        <CustomAlertDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Share note"
            description={
                published
                    ? "Anyone with this link can view a read-only copy of the note."
                    : "Publish this note to create a public read-only link."
            }
            cancel={{ text: "Close" }}
            action={{
                text: published ? "Copy link" : "Publish & copy",
                onClick: () => {
                    if (published) {
                        void handleCopy();
                    } else {
                        void handlePublishToggle(true);
                    }
                },
            }}
        >
            <div className="space-y-4 py-2">
                <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Globe className="size-4 text-muted-foreground" />
                        <Label htmlFor="publish-toggle" className="text-sm font-medium">
                            Public access
                        </Label>
                    </div>
                    <div className="flex items-center gap-2">
                        {busy && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
                        <Switch
                            id="publish-toggle"
                            checked={published}
                            disabled={busy || note._id === "new"}
                            onCheckedChange={(checked) => void handlePublishToggle(checked)}
                        />
                    </div>
                </div>
                {published && (
                    <div className="flex gap-2">
                        <Input readOnly value={shareUrl} className="font-mono text-xs" />
                        <Button type="button" variant="outline" size="icon" onClick={() => void handleCopy()}>
                            <LinkIcon className="size-4" />
                            <span className="sr-only">Copy link</span>
                        </Button>
                    </div>
                )}
            </div>
        </CustomAlertDialog>
    );
}
