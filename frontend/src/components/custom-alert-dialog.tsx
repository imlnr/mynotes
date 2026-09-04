import type { ReactNode } from "react"
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
    children?: ReactNode
}

export function CustomAlertDialog({
    open,
    onOpenChange,
    title,
    description,
    cancel,
    action,
    children,
}: CustomAlertDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel
                        onClick={cancel?.onClick}
                        variant={cancel?.variant}
                    >
                        {cancel?.text || "Cancel"}
                    </AlertDialogCancel>
                    {action && (
                        <AlertDialogAction
                            onClick={action.onClick}
                            variant={action.variant}
                        >
                            {action.text}
                        </AlertDialogAction>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
