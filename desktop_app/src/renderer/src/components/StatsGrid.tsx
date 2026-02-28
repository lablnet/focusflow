import { Activity, Clock } from 'lucide-react';
import { StatCard } from '@focusflow/ui';

interface StatsGridProps {
    focusScore: number;
    time: number;
    formatTime: (s: number) => string;
    category: string;
    currentWindow: string;
    isActive: boolean;
}

export default function StatsGrid({
    focusScore,
    time,
    formatTime,
    category,
    currentWindow,
    isActive,
}: StatsGridProps) {
    return (
        <div className="grid grid-cols-4 gap-3">
            <StatCard
                icon={<Activity className="w-3.5 h-3.5 text-emerald-500" />}
                label="Focus"
                value={`${focusScore}%`}
                progress={{ value: focusScore, variant: 'success' }}
            />
            <StatCard
                icon={<Clock className="w-3.5 h-3.5 text-sky-500" />}
                label="Session"
                value={formatTime(time)}
                subLabel="elapsed"
            />
            <StatCard
                icon={<Activity className="w-3.5 h-3.5 text-primary" />}
                label="Category"
                value={category}
                subLabel={isActive ? 'Tracking' : 'Idle'}
            />
            <StatCard
                icon={<Activity className="w-3.5 h-3.5 text-amber-500" />}
                label="Window"
                value={
                    <span className="text-sm font-semibold truncate block max-w-[140px]">
                        {currentWindow || 'Idle'}
                    </span>
                }
            />
        </div>
    );
}
