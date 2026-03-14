import * as React from "react"
import { PlusIcon, HistoryIcon, ChevronRightIcon, TerminalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store"
import { fetchNotes, updateNote, deleteNote, archiveNote } from "@/store/slices/notesSlice"
import { ActionDropdown } from "@/components/action-dropdown"
import { ActionIcons } from "@/utils/action-icons"
import { showToast } from "@/utils/toastUtils"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"

// Memoized Note Item to prevent re-renders when other notes or the editor state changes
const NoteItem = React.memo(({
  note,
  isActive,
  isEditing,
  tempTitle,
  onRenameStart,
  onRenameSubmit,
  onRenameChange,
  onRenameCancel,
  onDelete,
  onArchive,
  onShare
}: {
  note: any,
  isActive: boolean,
  isEditing: boolean,
  tempTitle: string,
  onRenameStart: (id: string, title: string) => void,
  onRenameSubmit: (id: string) => void,
  onRenameChange: (val: string) => void,
  onRenameCancel: () => void,
  onDelete: (id: string) => void,
  onArchive: (id: string) => void,
  onShare: (id: string) => void
}) => {
  const navigate = useNavigate();

  return (
    <SidebarMenuSubItem className="group/item relative">
      {isEditing ? (
        <div className="px-2 py-1">
          <Input
            autoFocus
            className="h-7 text-xs"
            value={tempTitle}
            onChange={(e) => onRenameChange(e.target.value)}
            onBlur={() => onRenameSubmit(note._id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onRenameSubmit(note._id)
              if (e.key === "Escape") onRenameCancel()
            }}
          />
        </div>
      ) : (
        <SidebarMenuSubButton
          asChild
          isActive={isActive}
          onDoubleClick={() => onRenameStart(note._id, note.title)}
          className="group-hover/item:bg-sidebar-accent group-hover/item:text-sidebar-accent-foreground"
        >
          <Link to={`/dashboard/note/${note._id}`} className="flex items-center justify-between pr-8">
            <span className="truncate">{note.title || "Untitled"}</span>
          </Link>
        </SidebarMenuSubButton>
      )}
      <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity z-10">
        <ActionDropdown
          actions={[
            { label: "Open", icon: ActionIcons.Open, onClick: () => navigate(`/dashboard/note/${note._id}`) },
            { label: "Rename", icon: ActionIcons.Rename, onClick: () => onRenameStart(note._id, note.title) },
            { label: "Share", icon: ActionIcons.Share, onClick: () => onShare(note._id) },
            { label: "Publish", icon: ActionIcons.Publish, onClick: () => showToast.success("Note published!") },
            { label: "Archive", icon: ActionIcons.Archive, onClick: () => onArchive(note._id) },
            { label: "Delete", icon: ActionIcons.Delete, variant: "destructive", onClick: () => onDelete(note._id) },
          ]}
          triggerClassName="h-6 w-6 hover:bg-sidebar-accent-foreground/10 cursor-pointer"
        />
      </div>
    </SidebarMenuSubItem>
  )
})

import { CustomAlertDialog } from "@/components/custom-alert-dialog"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const [noteToDelete, setNoteToDelete] = React.useState<string | null>(null)
  const { id: activeId } = useParams()
  const dispatch = useDispatch<AppDispatch>()

  // State to trigger dialog
  const handleDeleteTrigger = React.useCallback((id: string) => {
    setNoteToDelete(id)
  }, [])

  const confirmDelete = React.useCallback(async () => {
    if (!noteToDelete) return

    try {
      await dispatch(deleteNote(noteToDelete)).unwrap()
      showToast.success("Note deleted")
      navigate("/dashboard")
    } catch (err) {
      showToast.error("Failed to delete note")
    } finally {
      setNoteToDelete(null)
    }
  }, [dispatch, navigate, noteToDelete])

  const { items: notes, status } = useSelector((state: RootState) => state.notes)
  const loading = status === 'loading'

  // Get user from localStorage
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : { name: "User", email: "user@example.com", avatar: "" }

  // Local state for inline renaming
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [tempTitle, setTempTitle] = React.useState("")

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    // Fetch notes globally only if authenticated and not already loading/loaded
    if (token && status === 'idle') {
      console.log("[AppSidebar] Authenticated & Idle: Fetching notes")
      dispatch(fetchNotes())
    }
  }, [dispatch, status])

  const handleRenameStart = React.useCallback((id: string, currentTitle: string) => {
    setEditingId(id)
    setTempTitle(currentTitle || "Untitled")
  }, [])

  const handleRenameSubmit = React.useCallback(async (id: string) => {
    // We use a functional update or closure to get the latest tempTitle if needed
    // but here we can just use the state because it's stable enough for this callback
    setTempTitle(prev => {
      if (!prev.trim()) {
        setEditingId(null)
        return prev
      }

      const note = notes.find(n => n._id === id)
      if (note) {
        dispatch(updateNote({ id, title: prev, content: note.content }))
          .unwrap()
          .then(() => showToast.success("Note renamed"))
          .catch(() => showToast.error("Failed to rename note"))
      }
      setEditingId(null)
      return prev
    })
  }, [dispatch, notes])


  const handleArchive = React.useCallback(async (id: string) => {
    try {
      await dispatch(archiveNote(id)).unwrap()
      showToast.info("Note archived (Mock)")
    } catch (err) {
      showToast.error("Failed to archive note")
    }
  }, [dispatch])

  const handleShare = React.useCallback((id: string) => {
    const url = `${window.location.origin}/dashboard/note/${id}`
    navigator.clipboard.writeText(url)
    showToast.info("Link copied to clipboard!")
  }, [])

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
                      <div className="px-2 py-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : notes.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="px-2 py-1 text-xs text-muted-foreground">No notes yet</span>
                      </SidebarMenuSubItem>
                    ) : (
                      notes.map((note) => (
                        <NoteItem
                          key={note._id}
                          note={note}
                          isActive={activeId === note._id}
                          isEditing={editingId === note._id}
                          tempTitle={tempTitle}
                          onRenameStart={handleRenameStart}
                          onRenameSubmit={handleRenameSubmit}
                          onRenameChange={setTempTitle}
                          onRenameCancel={() => setEditingId(null)}
                          onDelete={handleDeleteTrigger}
                          onArchive={handleArchive}
                          onShare={handleShare}
                        />
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
        <NavUser user={user} />
      </SidebarFooter>
      <CustomAlertDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        action={{
          text: "Delete",
          variant: "destructive",
          onClick: confirmDelete,
        }}
      />
    </Sidebar>
  )
}
