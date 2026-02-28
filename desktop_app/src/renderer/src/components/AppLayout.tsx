import { ReactNode } from 'react';
import { Clock, Settings, LogOut, LayoutDashboard, History, PenLine } from 'lucide-react';
import { ThemeToggle } from '@focusflow/ui';
import { cn } from '@focusflow/ui';

interface AppLayoutProps {
    children: ReactNode;
    activeTab: string;
    onTabChange: (id: string) => void;
    onSettingsClick: () => void;
    onLogout: () => void;
    isFocusSession?: boolean;
}

const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'timeline', label: 'Logs', icon: History },
    { id: 'manual', label: 'Log Hours', icon: PenLine },
];

export default function AppLayout({
    children,
    activeTab,
    onTabChange,
    onSettingsClick,
    onLogout,
    isFocusSession,
}: AppLayoutProps) {
    return (
        <div className={cn(
            "h-screen flex overflow-hidden bg-background text-foreground transition-colors duration-300",
            isFocusSession && "ring-inset ring-4 ring-destructive/20"
        )}>
            {/* Sidebar */}
            <aside className="w-[200px] shrink-0 bg-card border-r border-border flex flex-col">
                {/* Logo */}
                <div className="p-4 flex items-center gap-2.5 border-b border-border">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm shadow-primary/20">
                        <Clock className="w-4.5 h-4.5 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-foreground">FocusFlow</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id || (item.id === 'manual' && false);
                        return (
                            <button
                                key={item.id}
                                onClick={() => onTabChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                {/* Bottom actions */}
                <div className="p-2 space-y-0.5 border-t border-border">
                    <div className="flex items-center justify-between px-3 py-1.5">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Theme</span>
                        <ThemeToggle />
                    </div>
                    <button
                        onClick={onSettingsClick}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-5">
                <div className="space-y-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
