import { PublicLayout } from "@/components/public-layout";

export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
                <h1 className="text-4xl font-bold tracking-tight">About Docables</h1>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                    Docables is a notes workspace for writing, organizing, and optionally
                    sharing documents. The working repository is called mynotes; Docables
                    is the product name you see in the app.
                </p>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                    Sign in, write in the block editor, keep drafts private, archive old
                    notes, and publish a read-only link when a note is ready to share.
                </p>
            </div>
        </PublicLayout>
    );
}
