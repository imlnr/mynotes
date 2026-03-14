import { Link } from "react-router-dom";

export function Footer() {
    return (
        <footer className="border-t border-border/40 py-6 md:px-8 md:py-0 w-full bg-background mt-auto">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row mx-auto px-4">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        Docables
                    </a>
                    . The source code is available on{" "}
                    <a
                        href="#"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium underline underline-offset-4"
                    >
                        GitHub
                    </a>
                    .
                </p>
                <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                    <Link to="/terms" className="hover:underline underline-offset-4">Terms</Link>
                    <Link to="/privacy" className="hover:underline underline-offset-4">Privacy</Link>
                </div>
            </div>
        </footer>
    );
}
