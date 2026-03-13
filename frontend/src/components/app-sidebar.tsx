import * as React from "react"
import { PlusIcon, HistoryIcon, ChevronRightIcon, TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchNotes } from "@/store/slices/notesSlice"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  // Select notes from Redux store
  const { items: notes, status } = useSelector((state: RootState) => state.notes)
  const loading = status === 'loading'

  React.useEffect(() => {
    // Fetch notes globally if not loaded (or always refresh if needed)
    dispatch(fetchNotes())
  }, [dispatch])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">MyNote</span>
                  <span className="truncate text-xs">Premium Editor</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-2">
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={() => navigate('/dashboard/note/new')}
          >
            <PlusIcon className="size-4" />
            <span>Create New Note</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="History">
                    <HistoryIcon />
                    <span>Recent Notes</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {loading && notes.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="px-2 py-1 text-xs text-muted-foreground animate-pulse">Loading...</span>
                      </SidebarMenuSubItem>
                    ) : notes.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="px-2 py-1 text-xs text-muted-foreground">No notes yet</span>
                      </SidebarMenuSubItem>
                    ) : (
                      notes.map((note) => (
                        <SidebarMenuSubItem key={note._id}>
                          <SidebarMenuSubButton asChild>
                            <Link to={`/dashboard/note/${note._id}`}>
                              <span>{note.title || "Untitled"}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
