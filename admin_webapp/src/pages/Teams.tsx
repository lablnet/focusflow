import Card from '../components/Card';
import { Users as UsersIcon, UserPlus, MoreVertical, Mail, Shield, ChevronRight } from 'lucide-react';
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight text-3xl font-bold text-white tracking-tight">Teams & Members</h1>
                    <p className="text-slate-400 mt-1">Manage your company structure and permissions.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 premium-gradient text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-500/25">
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <Card key={team.id} className="relative group cursor-pointer hover:bg-white/[0.07] border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{team.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">Lead: {team.lead}</p>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{team.members} Members</span>
                            <div className="flex items-center gap-1.5 ">
                                <div className={`w-1.5 h-1.5 rounded-full ${team.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
                                <span className="text-xs text-slate-400">{team.status}</span>
                            </div>
                        </div>
                    </Card>
                ))}
                <Card className="border-dashed border-2 border-white/5 flex flex-col items-center justify-center py-12 group cursor-pointer hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <UserPlus className="w-6 h-6 text-slate-500 group-hover:text-indigo-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-500 group-hover:text-slate-300">Create New Team</p>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white px-1">Recent Members</h2>
                <Card className="!p-0 overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-white/5 group-hover:border-indigo-500/30">
                                        {member.name[0]}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-white">{member.name}</h4>
                                        <div className="flex items-center gap-4 mt-0.5">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Mail className="w-3 h-3" />
                                                {member.email}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                <Shield className="w-3 h-3" />
                                                {member.role}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-xs font-medium text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                                        {member.team}
                                    </span>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-indigo-400 transition-colors" />
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
