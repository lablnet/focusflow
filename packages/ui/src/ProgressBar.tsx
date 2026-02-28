import { cn } from "./utils"

export type ProgressVariant = "primary" | "success" | "warning" | "destructive" | "sky" | "indigo";

export interface ProgressBarProps {
    value: number;
    max?: number;
    variant?: ProgressVariant;
    className?: string;
    size?: "sm" | "md";
}

const variantStyles: Record<ProgressVariant, string> = {
    primary: "bg-primary",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    destructive: "bg-destructive",
    sky: "bg-sky-500",
    indigo: "bg-indigo-500",
};

export function ProgressBar({ value, max = 100, variant = "primary", className, size = "sm" }: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={cn(
            "w-full bg-secondary rounded-full overflow-hidden",
            size === "sm" ? "h-1.5" : "h-2.5",
            className
        )}>
            <div
                className={cn("h-full rounded-full transition-all duration-700 ease-out", variantStyles[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}
