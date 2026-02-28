import * as React from "react"
import { cn } from "./utils"

export type BadgeVariant = "default" | "success" | "warning" | "destructive" | "outline" | "manual" | "auto";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-primary/10 text-primary border-primary/20",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    outline: "bg-transparent text-muted-foreground border-border",
    manual: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    auto: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
                variantStyles[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
