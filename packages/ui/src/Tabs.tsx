import * as React from "react"
import { cn } from "./utils"

export interface Tab {
    id: string;
    label: string;
    icon?: React.ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
    return (
        <nav className={cn("flex bg-secondary rounded-xl p-1 border border-border", className)}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                        activeTab === tab.id
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </nav>
    );
}
