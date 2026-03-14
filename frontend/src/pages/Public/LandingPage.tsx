import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center text-center px-4 md:px-6 py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Your thoughts, <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            organized beautifully.
                        </span>
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-balance leading-relaxed">
                        Notables is the lightning-fast, secure, and beautiful way to capture your ideas.
                        Sign in seamlessly with Google or Email.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                        <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate('/login')}>
                            Start Taking Notes
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                            Learn More
                        </Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
