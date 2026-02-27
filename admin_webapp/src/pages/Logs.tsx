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
    }, [search, selectedTeam, selectedDate, mockLogs]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Time Logs</h1>
                    <p className="text-muted-foreground mt-1">Detailed breakdown of team activities and tracked hours.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <Card className="!p-4">
                <div className="flex flex-col md:flex-row flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px] w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                        <Input
                            placeholder="Search by employee..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="h-8 w-px bg-border hidden md:block" />

                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="w-full md:w-48">
                            <DatePicker
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <SearchableSelect
                                options={teamOptions}
                                value={selectedTeam}
                                onChange={setSelectedTeam}
                                placeholder="Select Team"
                            />
                        </div>

                        <Button variant="secondary" size="icon" className="w-full sm:w-10">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time Range</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                                {log.user[0]}
                                            </div>
                                            <span className="text-sm font-medium">{log.user}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded border border-primary/20">
                                            {log.team}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono">{log.duration}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {log.start} - {log.end}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {log.date}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                                            <span className="text-xs">{log.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="icon" className="text-muted-foreground opacity-50 hover:opacity-100">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground text-sm">
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
