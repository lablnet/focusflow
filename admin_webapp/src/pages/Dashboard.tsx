import { Card } from '@focusflow/ui';
import { Users, Clock, Activity, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <Card className="relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/10 transition-colors`} />
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-400 text-sm font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{trend}</span>
            </div>
            <span className="text-slate-500 text-xs">vs last month</span>
        </div>
    </Card>
);

const Dashboard = () => {
    const stats = [
        { icon: Users, label: 'Total Employees', value: '124', trend: '+12%', color: 'indigo' },
        { icon: Clock, label: 'Average Daily Hours', value: '7.4h', trend: '+5%', color: 'emerald' },
        { icon: Activity, label: 'Active Now', value: '86', trend: '+18%', color: 'amber' },
        { icon: Calendar, label: 'Project Deadlines', value: '8', trend: 'On track', color: 'rose' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-white tracking-tight">Overview</h1>
                    <p className="text-slate-400 mt-2">Welcome back, here's what's happening with your teams today.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-all">
                        Download Report
                    </button>
                    <button className="px-4 py-2 premium-gradient text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-all">
                        Add New Member
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" title="Activity Over Time">
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
                        <p className="text-slate-500 italic">Activity chart visualization will be integrated here</p>
                    </div>
                </Card>
                <Card title="Recent Notifications">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-white font-medium group-hover:text-indigo-400">Team Alpha added a new project</p>
                                    <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Dashboard;
