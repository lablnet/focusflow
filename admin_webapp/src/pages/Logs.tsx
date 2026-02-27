import { useState, useMemo } from 'react';
import { Card, Input, Button, SearchableSelect, DatePicker } from '@focusflow/ui';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const TimeLogs = () => {
    const [search, setSearch] = useState('');
    const [selectedTeam, setSelectedTeam] = useState('All');
    const [selectedDate, setSelectedDate] = useState('');

    const mockLogs = [
        { id: 1, user: 'John Doe', team: 'Design', duration: '7h 20m', start: '09:00 AM', end: '04:20 PM', status: 'Completed', date: '2023-10-24' },
        { id: 2, user: 'Alice Smith', team: 'Development', duration: '8h 05m', start: '08:30 AM', end: '04:35 PM', status: 'Completed', date: '2023-10-24' },
        { id: 3, user: 'Bob Johnson', team: 'Marketing', duration: '4h 15m', start: '10:00 AM', end: '02:15 PM', status: 'In Progress', date: '2023-10-24' },
        { id: 4, user: 'Sarah Wilson', team: 'Design', duration: '6h 45m', start: '09:15 AM', end: '04:00 PM', status: 'Completed', date: '2023-10-24' },
    ];

    const teamOptions = [
        { label: 'All Teams', value: 'All' },
        { label: 'Design', value: 'Design' },
        { label: 'Development', value: 'Development' },
        { label: 'Marketing', value: 'Marketing' },
    ];

    const filteredLogs = useMemo(() => {
        return mockLogs.filter(log => {
            const matchesSearch = log.user.toLowerCase().includes(search.toLowerCase());
            const matchesTeam = selectedTeam === 'All' || log.team === selectedTeam;
            const matchesDate = !selectedDate || log.date === selectedDate;
            return matchesSearch && matchesTeam && matchesDate;
        });
    }, [search, selectedTeam, selectedDate]);

    const teamColor: Record<string, string> = {
        Design: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
        Development: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
        Marketing: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Time Logs</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Detailed breakdown of team activities and tracked hours.</p>
                </div>
                <Button variant="outline" className="gap-2 text-xs h-9">
                    <Download className="w-4 h-4" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <Card className="!p-4">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Input
                            placeholder="Search by employee…"
                            className="pl-10 bg-muted/40 border-border/60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="h-8 w-px bg-border/40 hidden md:block" />

                    <div className="flex items-center gap-2">
                        <div className="w-44">
                            <DatePicker
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <div className="w-44">
                            <SearchableSelect
                                options={teamOptions}
                                value={selectedTeam}
                                onChange={setSelectedTeam}
                                placeholder="Select Team"
                            />
                        </div>
                        <Button variant="secondary" size="icon" className="shrink-0">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="border-b border-border/60">
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Team</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Time Range</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-accent/40 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xs font-bold text-primary border border-primary/15">
                                                {log.user[0]}
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase rounded-md border ${teamColor[log.team] ?? 'bg-muted text-muted-foreground border-border'}`}>
                                            {log.team}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-mono text-foreground">{log.duration}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                        {log.start} – {log.end}
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                                        {log.date}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            <span className={`text-xs font-medium ${log.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{log.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground/50 hover:text-foreground">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground text-sm">
                                        No logs found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </motion.div>
    );
};

export default TimeLogs;
