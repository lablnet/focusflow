import { Card, Button } from '@focusflow/ui';
import { Users, Clock, Activity, TrendingUp, Calendar, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
    <Card className="relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-${color}-500/20 transition-colors`} />
        <div className="flex items-start justify-between relative z-10">
            <div>
                <p className="text-muted-foreground text-sm font-medium">{label}</p>
                <h3 className="text-3xl font-bold text-foreground mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
                <Icon className={`w-6 h-6 text-${color}-500`} />
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 relative z-10">
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                <span>{trend}</span>
            </div>
            <span className="text-muted-foreground text-xs">vs last month</span>
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
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-2">Welcome back, here's what's happening with your teams today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Report
                    </Button>
                    <Button className="gap-2 shadow-lg shadow-primary/25">
                        <Plus className="w-4 h-4" />
                        New Member
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2" title="Activity Over Time">
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-xl">
                        <p className="text-muted-foreground italic">Activity chart visualization will be integrated here</p>
                    </div>
                </Card>
                <Card title="Recent Notifications">
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer group border border-transparent hover:border-border">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">Team Alpha added a new project</p>
                                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
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
