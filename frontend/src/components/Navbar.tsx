import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

export function Navbar() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleAuthAction = () => {
        if (isAuthenticated) {
            // Option to go right to the dashboard if already logged in!
            navigate("/dashboard");
        } else {
            navigate("/login");
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
                <div className="mr-4 hidden md:flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            Docables 📝
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            to="/features"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Features
                        </Link>
                        <Link
                            to="/pricing"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Pricing
                        </Link>
                        <Link
                            to="/about"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Can add a search input here later if needed */}
                    </div>
                    <nav className="flex items-center gap-2">
                        {!isAuthenticated && (
                            <Button variant="ghost" onClick={() => navigate("/login")} className="hidden md:flex">
                                Log in
                            </Button>
                        )}
                        <Button onClick={handleAuthAction}>
                            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    );
}
