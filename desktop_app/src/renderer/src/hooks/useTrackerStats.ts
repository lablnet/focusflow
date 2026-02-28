import { useState, useEffect } from 'react';

interface TrackerStats {
    keystrokes: number;
    mouseMoves: number;
    currentWindow: string;
    focusScore: number;
    category: string;
}

const defaultStats: TrackerStats = {
    keystrokes: 0,
    mouseMoves: 0,
    currentWindow: '',
    focusScore: 0,
    category: 'Other',
};

export function useTrackerStats(isActive: boolean, pollInterval = 5000) {
    const [stats, setStats] = useState<TrackerStats>(defaultStats);

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(async () => {
            try {
                const currentStats = await window.api.tracker.getStatus();
                setStats({
                    keystrokes: currentStats.keystrokes,
                    mouseMoves: currentStats.mouseMoves,
                    currentWindow: currentStats.currentWindow,
                    focusScore: currentStats.focusScore,
                    category: currentStats.category,
                });
            } catch (err) {
                console.error('Failed to fetch tracker stats:', err);
            }
        }, pollInterval);
        return () => clearInterval(interval);
    }, [isActive, pollInterval]);

    return stats;
}
