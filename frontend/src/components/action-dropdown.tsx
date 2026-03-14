import { MoreVertical, type LucideIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DropdownAction {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    variant?: "default" | "destructive";
}

interface ActionDropdownProps {
    actions: DropdownAction[];
    triggerClassName?: string;
    buttonVariant?: "ghost" | "outline" | "default" | "secondary";
    align?: "start" | "center" | "end";
}

export function ActionDropdown({
    actions,
    triggerClassName,
    buttonVariant = "ghost",
    align = "end",
}: ActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={buttonVariant}
                    size="icon"
                    className={cn("h-8 w-8 rounded-full", triggerClassName)}
                    onClick={(e) => e.stopPropagation()} // Prevent row clicks in lists
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={align} className="w-40" onClick={(e) => e.stopPropagation()}>
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <DropdownMenuItem
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                action.onClick();
                            }}
                            className={cn(
                                "flex items-center gap-2 cursor-pointer",
                                action.variant === "destructive" && "text-destructive focus:text-destructive"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
