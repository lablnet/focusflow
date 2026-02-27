import { Card, Button } from '@focusflow/ui';
import { Users, Clock, Activity, TrendingUp, Calendar, Download, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', glow: 'bg-indigo-400/20' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', glow: 'bg-emerald-400/20' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-600 dark:text-amber-400', glow: 'bg-amber-400/20' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-600 dark:text-rose-400', glow: 'bg-rose-400/20' },
};

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => {
    const c = colors[color] ?? colors.indigo;
    return (
        <Card className="relative overflow-hidden group hover:translate-y-[-2px]">
            <div className={`absolute -top-12 -right-12 w-32 h-32 ${c.glow} blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-muted-foreground text-sm font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-foreground mt-2 tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${c.bg} ${c.border} border`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
            </div>
            <div className="mt-5 flex items-center gap-2 relative z-10">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span>{trend}</span>
                </div>
                <span className="text-muted-foreground/70 text-xs">vs last month</span>
            </div>
        </Card>
    );
};

const Dashboard = () => {
    const stats = [
        { icon: Users, label: 'Total Employees', value: '124', trend: '+12%', color: 'indigo' },
        { icon: Clock, label: 'Avg. Daily Hours', value: '7.4h', trend: '+5%', color: 'emerald' },
        { icon: Activity, label: 'Active Now', value: '86', trend: '+18%', color: 'amber' },
        { icon: Calendar, label: 'Deadlines', value: '8', trend: 'On track', color: 'rose' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back — here&apos;s what&apos;s happening with your teams today.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 text-xs h-9">
                        <Download className="w-4 h-4" />
                        Report
                    </Button>
                    <Button className="gap-2 text-xs h-9 shadow-md shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        New Member
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07, duration: 0.35 }}
                    >
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="lg:col-span-2" title="Activity Over Time">
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-muted/30">
                        <p className="text-muted-foreground/60 text-sm italic">Chart will be rendered here</p>
                    </div>
                </Card>
                <Card title="Recent Activity">
                    <div className="space-y-1">
                        {[
                            { name: 'Team Alpha added new project', time: '2h ago' },
                            { name: 'Sarah completed sprint review', time: '4h ago' },
                            { name: 'New member joined Design', time: '6h ago' },
                            { name: 'Deployment #421 succeeded', time: '1d ago' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-accent/60 transition-colors cursor-pointer group">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center shrink-0">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">{item.name}</p>
                                    <p className="text-xs text-muted-foreground/70 mt-0.5">{item.time}</p>
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
