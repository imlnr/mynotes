import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store";

export default function LandingPage() {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(useAppSelector((state) => state.auth.token));

    return (
        <PublicLayout>
            <div className="flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4 py-12 text-center md:px-6 md:py-24 lg:py-32 xl:py-48">
                <div className="max-w-3xl space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Your thoughts, <br className="hidden sm:inline" />
                        <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            organized beautifully.
                        </span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground leading-relaxed md:text-xl/relaxed lg:text-balance">
                        Docables is a fast, private notes workspace with a block editor,
                        email or Google sign-in, and public share links when you want them.
                    </p>
                    <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
                        <Button
                            size="lg"
                            className="h-12 px-8 text-base"
                            onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
                        >
                            {isAuthenticated ? "Open Dashboard" : "Start Taking Notes"}
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-8 text-base"
                            onClick={() => navigate("/features")}
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
