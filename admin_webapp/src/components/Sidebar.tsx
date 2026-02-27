import { LayoutDashboard, Users, Clock, Settings, LogOut, Shield } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const Sidebar = () => {
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Teams', path: '/teams' },
        { icon: Clock, label: 'Time Logs', path: '/logs' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col z-50 bg-sidebar border-r border-sidebar-border">
            {/* Logo */}
            <div className="h-20 px-6 flex items-center gap-3 border-b border-sidebar-border">
                <div className="w-9 h-9 premium-gradient rounded-lg flex items-center justify-center shadow-md shadow-primary/30">
                    <Shield className="text-white w-[18px] h-[18px]" />
                </div>
                <span className="text-lg font-bold tracking-tight text-sidebar-foreground">FocusFlow</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${isActive
                                ? 'premium-gradient text-white shadow-md shadow-primary/25'
                                : 'text-muted-foreground hover:text-foreground hover:bg-sidebar-accent'
                            }`
                        }
                    >
                        <item.icon className="w-[18px] h-[18px]" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-sidebar-border">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-[13px] font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
