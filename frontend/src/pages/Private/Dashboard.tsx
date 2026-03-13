import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate('/dashboard/note/new', { replace: true });
    }, [navigate]);

    return (
        <SidebarWrapper>
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        </SidebarWrapper>
    )
}
