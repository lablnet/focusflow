import { useState, useEffect, useCallback } from 'react';

export function useBlocklist() {
    const [blocklist, setBlocklist] = useState<string[]>([]);

    useEffect(() => {
        window.api.tracker.getBlocklist()
            .then(setBlocklist)
            .catch((err) => console.error('Failed to fetch blocklist:', err));
    }, []);

    const addKeyword = useCallback(async (keyword: string) => {
        if (!keyword.trim()) return;
        const newList = [...blocklist, keyword.trim()];
        try {
            await window.api.tracker.updateBlocklist(newList);
            setBlocklist(newList);
        } catch (err) {
            console.error('Failed to add block keyword:', err);
        }
    }, [blocklist]);

    const removeKeyword = useCallback(async (keyword: string) => {
        const newList = blocklist.filter((k) => k !== keyword);
        try {
            await window.api.tracker.updateBlocklist(newList);
            setBlocklist(newList);
        } catch (err) {
            console.error('Failed to remove block keyword:', err);
        }
    }, [blocklist]);

    return { blocklist, addKeyword, removeKeyword };
}
