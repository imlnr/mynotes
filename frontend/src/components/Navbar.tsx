import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAppSelector } from "@/store";

export function Navbar() {
    const navigate = useNavigate();
    const isAuthenticated = Boolean(useAppSelector((state) => state.auth.token));

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
                <div className="mr-4 hidden md:flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            Docables
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            to="/features"
                            className="text-foreground/60 transition-colors hover:text-foreground/80"
                        >
                            Features
                        </Link>
                        <Link
                            to="/pricing"
                            className="text-foreground/60 transition-colors hover:text-foreground/80"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/about"
                            className="text-foreground/60 transition-colors hover:text-foreground/80"
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <Link to="/" className="font-bold md:hidden">
                        Docables
                    </Link>
                    <nav className="flex items-center gap-2">
                        {!isAuthenticated && (
                            <Button variant="ghost" onClick={() => navigate("/login")} className="hidden md:flex">
                                Log in
                            </Button>
                        )}
                        <Button onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}>
                            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
