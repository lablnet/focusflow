import { useCallback } from 'react';

export interface ManualLogEntry {
    date: string;       // ISO date string
    hours: number;
    memo: string;
    category: string;
}

export function useManualLog() {
    const addManualLog = useCallback(async (entry: ManualLogEntry) => {
        try {
            const result = await window.api.tracker.addManualLog(entry);
            return result;
        } catch (err) {
            console.error('Failed to add manual log:', err);
            return false;
        }
    }, []);

    return { addManualLog };
}
