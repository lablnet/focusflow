import { useState, useEffect, useCallback } from 'react';

export function useTimer() {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return;
        const interval = setInterval(() => setTime((t) => t + 1), 1000);
        return () => clearInterval(interval);
    }, [isActive]);

    const start = useCallback(() => setIsActive(true), []);
    const stop = useCallback(() => setIsActive(false), []);
    const reset = useCallback(() => setTime(0), []);

    const formatTime = useCallback((seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return { time, isActive, start, stop, reset, formatTime, setIsActive };
}
