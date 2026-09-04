import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="mt-auto w-full border-t border-border/40 bg-background py-6 md:px-8 md:py-0">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built for capturing ideas with{" "}
                    <Link to="/" className="font-medium underline underline-offset-4">
                        Docables
                    </Link>
                    . Source on{" "}
                    <a
                        href="https://github.com/imlnr/mynotes"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <Link to="/features" className="underline-offset-4 hover:underline">Features</Link>
                    <Link to="/about" className="underline-offset-4 hover:underline">About</Link>
                </div>
            </div>
        </footer>
    );
}
