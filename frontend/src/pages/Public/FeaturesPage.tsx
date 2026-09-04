import { PublicLayout } from "@/components/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Link2, Lock, Mail } from "lucide-react";

const features = [
    {
        icon: FileText,
        title: "Block editor",
        description: "Write with a Notion-style editor that autosaves as you type.",
    },
    {
        icon: Lock,
        title: "Private by default",
        description: "Notes stay on your account until you explicitly publish a share link.",
    },
    {
        icon: Link2,
        title: "Public sharing",
        description: "Publish a read-only link so anyone can view a note without logging in.",
    },
    {
        icon: Mail,
        title: "Simple sign-in",
        description: "Log in with a one-time email code or Google. No password to remember.",
    },
];

export default function FeaturesPage() {
    return (
        <PublicLayout>
            <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Features</h1>
                    <p className="mt-3 text-muted-foreground">
                        Everything you need to capture ideas and share them on your terms.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                    {features.map((feature) => (
                        <Card key={feature.title}>
                            <CardContent className="space-y-3 p-6">
                                <feature.icon className="size-6 text-primary" />
                                <h2 className="text-xl font-semibold">{feature.title}</h2>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
