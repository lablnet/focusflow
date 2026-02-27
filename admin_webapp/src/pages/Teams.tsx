import { Users as UsersIcon, UserPlus, MoreVertical, Mail, Shield, ChevronRight } from 'lucide-react';
import { Card, Button } from '@focusflow/ui';
import { motion } from 'framer-motion';

const Teams = () => {
    const teams = [
        { id: 1, name: 'Design Team', members: 12, lead: 'Sarah Wilson', status: 'Active' },
        { id: 2, name: 'Core Development', members: 45, lead: 'John Doe', status: 'Active' },
        { id: 3, name: 'Marketing & Sales', members: 18, lead: 'Alice Smith', status: 'On Break' },
    ];

    const members = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', team: 'Core Development' },
        { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'Manager', team: 'Marketing' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Employee', team: 'Design' },
        { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Manager', team: 'Design' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Teams & Members</h1>
                    <p className="text-muted-foreground mt-1">Manage your company structure and permissions.</p>
                </div>
                <Button className="gap-2 shadow-lg shadow-primary/25">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <Card key={team.id} className="relative group cursor-pointer hover:bg-muted/50 border-transparent hover:border-border transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{team.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Lead: {team.lead}</p>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{team.members} Members</span>
                            <div className="flex items-center gap-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${team.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-muted-foreground'}`} />
                                <span className="text-xs text-muted-foreground">{team.status}</span>
                            </div>
                        </div>
                    </Card>
                ))}
                <Card className="border-dashed border-2 border-border flex flex-col items-center justify-center py-12 group cursor-pointer hover:bg-muted/50 transition-all shadow-none">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UserPlus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">Create New Team</p>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-foreground px-1">Recent Members</h2>
                <Card className="!p-0 overflow-hidden">
                    <div className="divide-y divide-border">
                        {members.map((member) => (
                            <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-muted/50 transition-colors group gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary border border-primary/20 group-hover:border-primary/40 transition-colors">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{member.name}</h4>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3" />
                                                {member.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Shield className="w-3 h-3" />
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0">
                                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-md border border-border">
                                        {member.team}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
