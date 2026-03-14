import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ActionConfig {
    text: string
    onClick?: () => void
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

interface CustomAlertDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    cancel?: ActionConfig
    action?: ActionConfig
}

export function CustomAlertDialog({
    open,
    onOpenChange,
    title,
    description,
    cancel,
    action,
}: CustomAlertDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={cancel?.onClick}
                        variant={cancel?.variant}
                    >
                        {cancel?.text || "Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={action?.onClick}
                        variant={action?.variant}
                    >
                        {action?.text || "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
