import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/dashboard/note/new', { replace: true });
    }, [navigate]);

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full pt-8 h-full">
            <Skeleton className="h-12 w-3/4" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>
        </div>
    )
}
