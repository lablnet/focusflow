import * as React from "react"
import { cn } from "./utils"

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "text-center p-12 bg-card/50 rounded-3xl border border-dashed border-border",
            className
        )}>
            {icon && (
                <div className="flex justify-center mb-4 text-muted-foreground/50">
                    {icon}
                </div>
            )}
            <p className="text-muted-foreground font-medium mb-1">{title}</p>
            {description && (
                <p className="text-sm text-muted-foreground/60">{description}</p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}
