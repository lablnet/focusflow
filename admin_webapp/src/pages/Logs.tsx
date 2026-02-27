import { useState } from 'react';
import { Card } from '@focusflow/ui';
import { Search, Filter, Calendar, Users as UsersIcon, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const TimeLogs = () => {
    const [search, setSearch] = useState('');

    const mockLogs = [
        { id: 1, user: 'John Doe', team: 'Design', duration: '7h 20m', start: '09:00 AM', end: '04:20 PM', status: 'Completed', date: 'Oct 24, 2023' },
        { id: 2, user: 'Alice Smith', team: 'Development', duration: '8h 05m', start: '08:30 AM', end: '04:35 PM', status: 'Completed', date: 'Oct 24, 2023' },
        { id: 3, user: 'Bob Johnson', team: 'Marketing', duration: '4h 15m', start: '10:00 AM', end: '02:15 PM', status: 'In Progress', date: 'Oct 24, 2023' },
        { id: 4, user: 'Sarah Wilson', team: 'Design', duration: '6h 45m', start: '09:15 AM', end: '04:00 PM', status: 'Completed', date: 'Oct 24, 2023' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Time Logs</h1>
                    <p className="text-slate-400 mt-1">Detailed breakdown of team activities and tracked hours.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 glass border border-white/5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all text-slate-300">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="!p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by employee..."
                            className="w-full bg-slate-900/50 border border-white/5 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm transition-all text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="h-8 w-px bg-white/5 hidden md:block" />

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
                            <Calendar className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs text-slate-300 font-medium">Oct 24, 2023</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
                            <UsersIcon className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs text-slate-300 font-medium">All Teams</span>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-white/5 rounded-lg cursor-pointer hover:bg-slate-900 transition-colors">
                            <Filter className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs text-slate-300 font-medium">More Filters</span>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Team</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Range</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mockLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-indigo-400 border border-white/5">
                                                {log.user[0]}
                                            </div>
                                            <span className="text-sm font-medium text-white">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase rounded border border-indigo-500/20">
                                            {log.team}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-300 font-mono">{log.duration}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">
                                        {log.start} - {log.end}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                            <span className="text-xs text-slate-300">{log.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-500 hover:text-white transition-colors">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default TimeLogs;
