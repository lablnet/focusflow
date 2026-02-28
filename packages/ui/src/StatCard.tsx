import * as React from "react"
import { cn } from "./utils"
import { ProgressBar, type ProgressVariant } from "./ProgressBar"

export interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    subLabel?: string;
    progress?: {
        value: number;
        max?: number;
        variant?: ProgressVariant;
    };
    className?: string;
    onClick?: () => void;
}

export function StatCard({ icon, label, value, subLabel, progress, className, onClick }: StatCardProps) {
    return (
        <div
            className={cn(
                "bg-card border border-border rounded-2xl p-5 relative overflow-hidden transition-all duration-300",
                onClick && "cursor-pointer hover:border-primary/40 hover:shadow-md",
                className
            )}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-2">
                <span className="text-primary">{icon}</span>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{label}</p>
            </div>
            <p className="text-xl font-bold text-foreground">{value}</p>
            {subLabel && (
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{subLabel}</p>
            )}
            {progress && (
                <div className="mt-2">
                    <ProgressBar
                        value={progress.value}
                        max={progress.max}
                        variant={progress.variant || "primary"}
                    />
                </div>
            )}
        </div>
    );
}
