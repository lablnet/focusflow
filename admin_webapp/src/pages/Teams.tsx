import { Users as UsersIcon, UserPlus, MoreVertical, Mail, Shield, ChevronRight } from 'lucide-react';
import { Card, Button } from '@focusflow/ui';
import { motion } from 'framer-motion';

const Teams = () => {
    const teams = [
        { id: 1, name: 'Design Team', members: 12, lead: 'Sarah Wilson', status: 'Active', color: 'indigo' },
        { id: 2, name: 'Core Development', members: 45, lead: 'John Doe', status: 'Active', color: 'emerald' },
        { id: 3, name: 'Marketing & Sales', members: 18, lead: 'Alice Smith', status: 'On Break', color: 'amber' },
    ];

    const members = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', team: 'Core Development' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'Manager', team: 'Marketing' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Employee', team: 'Design' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Manager', team: 'Design' },
    ];

    const colorMap: Record<string, string> = {
        indigo: 'from-indigo-500/20 to-indigo-500/5',
        emerald: 'from-emerald-500/20 to-emerald-500/5',
        amber: 'from-amber-500/20 to-amber-500/5',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Teams & Members</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage your company structure and permissions.</p>
                </div>
                <Button className="gap-2 text-xs h-9 shadow-md shadow-primary/20">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {teams.map((team, i) => (
                    <motion.div
                        key={team.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.35 }}
                    >
                        <Card className="relative group cursor-pointer hover:translate-y-[-2px] overflow-hidden">
                            <div className={`absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br ${colorMap[team.color] ?? colorMap.indigo} blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 rounded-full`} />
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary border border-primary/15">
                                    <UsersIcon className="w-5 h-5" />
                                </div>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors relative z-10">{team.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 relative z-10">Lead: {team.lead}</p>
                            <div className="mt-5 flex items-center justify-between relative z-10">
                                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{team.members} members</span>
                                <div className="flex items-center gap-1.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${team.status === 'Active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                    <span className="text-[11px] text-muted-foreground">{team.status}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {/* Create New Team */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: teams.length * 0.06, duration: 0.35 }}
                >
                    <div className="h-full border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center py-12 group cursor-pointer hover:border-primary/30 hover:bg-accent/40 transition-all duration-300">
                        <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-primary/10 transition-all">
                            <UserPlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Create New Team</p>
                    </div>
                </motion.div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Members</h2>
                <Card className="!p-0 overflow-hidden">
                    <div className="divide-y divide-border/60">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between px-5 py-4 hover:bg-accent/40 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-sm font-bold text-primary border border-primary/15 group-hover:border-primary/30 transition-colors">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {member.email}
                                            </div>
                                            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                <Shield className="w-3 h-3" />
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                                        {member.team}
                                    </span>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Teams;
