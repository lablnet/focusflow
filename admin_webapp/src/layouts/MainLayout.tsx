import Sidebar from '../components/Sidebar';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { ThemeToggle } from '@focusflow/ui';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const user = useUserStore((state) => state.session?.user);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar />

            <main className="pl-64 min-h-screen">
                {/* Header */}
                <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-border/60">
                    <div className="relative w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search anything…"
                            className="w-full bg-muted/50 border-none rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-background" />
                        </button>

                        <div className="h-8 w-px bg-border" />

                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-foreground">{user?.name || 'Admin User'}</p>
                                <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{user?.role || 'Administrator'}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/10 transition-all">
                                <UserIcon className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
