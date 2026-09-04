import type { ReactNode } from "react"
import { useLocation, Link } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/store"

export function SidebarWrapper({ children }: { children: ReactNode }) {
    const location = useLocation()
    const { currentNote, items } = useAppSelector((state) => state.notes)
    const noteId = location.pathname.split("/dashboard/note/")[1]
    const isNew = noteId === "new" || location.pathname.endsWith("/note/new")
    const note = items.find((n) => n._id === noteId) || currentNote
    const isEditor = location.pathname.includes("/dashboard/note/")

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to="/dashboard">Notes</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {isEditor && (
                                <>
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {isNew ? "New note" : (note?.title || "Untitled")}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </>
                            )}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
