import * as React from "react"
import { PlusIcon, HistoryIcon, ChevronRightIcon, ArchiveIcon, FileTextIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store"
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
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { ShareNoteDialog } from "@/components/share-note-dialog"
import type { Note } from "@/types/note"

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
  note: Note
  isActive: boolean
  isEditing: boolean
  tempTitle: string
  onRenameStart: (id: string, title: string) => void
  onRenameSubmit: (id: string) => void
  onRenameChange: (val: string) => void
  onRenameCancel: () => void
  onDelete: (id: string) => void
  onArchive: (note: Note) => void
  onShare: (note: Note) => void
}) => {
  const navigate = useNavigate()

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
      <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
        <ActionDropdown
          actions={[
            { label: "Open", icon: ActionIcons.Open, onClick: () => navigate(`/dashboard/note/${note._id}`) },
            { label: "Rename", icon: ActionIcons.Rename, onClick: () => onRenameStart(note._id, note.title) },
            { label: "Share", icon: ActionIcons.Share, onClick: () => onShare(note) },
            { label: note.isArchived ? "Restore" : "Archive", icon: ActionIcons.Archive, onClick: () => onArchive(note) },
            { label: "Delete", icon: ActionIcons.Delete, variant: "destructive", onClick: () => onDelete(note._id) },
          ]}
          triggerClassName="h-6 w-6 hover:bg-sidebar-accent-foreground/10 cursor-pointer"
        />
      </div>
    </SidebarMenuSubItem>
  )
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const [noteToDelete, setNoteToDelete] = React.useState<string | null>(null)
  const [shareNote, setShareNote] = React.useState<Note | null>(null)
  const { id: activeId } = useParams()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  const handleDeleteTrigger = React.useCallback((id: string) => {
    setNoteToDelete(id)
  }, [])

  const confirmDelete = React.useCallback(async () => {
    if (!noteToDelete) return

    try {
      await dispatch(deleteNote(noteToDelete)).unwrap()
      showToast.success("Note deleted")
      if (activeId === noteToDelete) navigate("/dashboard")
    } catch {
      showToast.error("Failed to delete note")
    } finally {
      setNoteToDelete(null)
    }
  }, [dispatch, navigate, noteToDelete, activeId])

  const { items: notes, status } = useAppSelector((state) => state.notes)
  const loading = status === "loading"
  const activeNotes = notes.filter((note) => !note.isArchived)
  const archivedNotes = notes.filter((note) => note.isArchived)

  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [tempTitle, setTempTitle] = React.useState("")

  React.useEffect(() => {
    if (token && status === "idle") {
      dispatch(fetchNotes())
    }
  }, [dispatch, status, token])

  const handleRenameStart = React.useCallback((id: string, currentTitle: string) => {
    setEditingId(id)
    setTempTitle(currentTitle || "Untitled")
  }, [])

  const handleRenameSubmit = React.useCallback(async (id: string) => {
    const nextTitle = tempTitle.trim()
    setEditingId(null)
    if (!nextTitle) return

    const note = notes.find((n) => n._id === id)
    if (!note || note.title === nextTitle) return

    try {
      await dispatch(updateNote({ id, title: nextTitle })).unwrap()
      showToast.success("Note renamed")
    } catch {
      showToast.error("Failed to rename note")
    }
  }, [dispatch, notes, tempTitle])

  const handleArchive = React.useCallback(async (note: Note) => {
    try {
      await dispatch(archiveNote({ id: note._id, archived: !note.isArchived })).unwrap()
      showToast.success(note.isArchived ? "Note restored" : "Note archived")
      if (!note.isArchived && activeId === note._id) {
        navigate("/dashboard")
      }
    } catch {
      showToast.error("Failed to archive note")
    }
  }, [dispatch, activeId, navigate])

  const liveShareNote = shareNote
    ? notes.find((n) => n._id === shareNote._id) || shareNote
    : null

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <FileTextIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Docables</span>
                  <span className="truncate text-xs">Notes workspace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="px-2 py-2">
          <Button
            className="w-full justify-start gap-2"
            variant="outline"
            onClick={() => navigate("/dashboard/note/new")}
          >
            <PlusIcon className="size-4" />
            <span>Create New Note</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Recent notes">
                    <HistoryIcon />
                    <span>Recent Notes</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {loading && notes.length === 0 ? (
                      <div className="space-y-2 px-2 py-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ) : activeNotes.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="px-2 py-1 text-xs text-muted-foreground">No notes yet</span>
                      </SidebarMenuSubItem>
                    ) : (
                      activeNotes.map((note) => (
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
                          onShare={setShareNote}
                        />
                      ))
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <Collapsible asChild className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="Archived notes">
                    <ArchiveIcon />
                    <span>Archived</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {archivedNotes.length === 0 ? (
                      <SidebarMenuSubItem>
                        <span className="px-2 py-1 text-xs text-muted-foreground">Nothing archived</span>
                      </SidebarMenuSubItem>
                    ) : (
                      archivedNotes.map((note) => (
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
                          onShare={setShareNote}
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
        <NavUser
          user={{
            name: user?.name || "User",
            email: user?.email || "",
            avatar: user?.avatar || "",
          }}
        />
      </SidebarFooter>
      <CustomAlertDialog
        open={!!noteToDelete}
        onOpenChange={(open) => !open && setNoteToDelete(null)}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        action={{
          text: "Delete",
          variant: "destructive",
          onClick: () => void confirmDelete(),
        }}
      />
      <ShareNoteDialog
        open={Boolean(shareNote)}
        onOpenChange={(open) => !open && setShareNote(null)}
        note={liveShareNote}
      />
    </Sidebar>
  )
}
