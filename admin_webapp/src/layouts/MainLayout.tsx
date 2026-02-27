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
                <header className="h-20 glass sticky top-0 z-40 px-8 flex items-center justify-between border-b border-border">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="w-full bg-secondary/50 border border-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <ThemeToggle />
                        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950" />
                        </button>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="text-right">
                                <p className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-slate-400 uppercase tracking-widest">{user?.role || 'Administrator'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:border-indigo-500/50 transition-all">
                                <UserIcon className="w-5 h-5 text-indigo-400" />
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
