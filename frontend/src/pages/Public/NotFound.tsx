import { PublicLayout } from "@/components/public-layout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <PublicLayout>
            <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
                <p className="text-sm font-medium text-muted-foreground">404</p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
                <p className="mt-2 max-w-md text-muted-foreground">
                    That page does not exist. Head back home or open your notes.
                </p>
                <div className="mt-6 flex gap-3">
                    <Button onClick={() => navigate("/")}>Home</Button>
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                        Dashboard
                    </Button>
                </div>
            </div>
        </PublicLayout>
    );
}
