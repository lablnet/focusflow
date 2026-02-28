import { useState, useCallback } from 'react';

export function useFocusSession() {
    const [isFocusSession, setIsFocusSession] = useState(false);

    const toggleFocus = useCallback(async () => {
        try {
            const newState = !isFocusSession;
            const success = await window.api.tracker.focusToggle(newState);
            if (success !== undefined) setIsFocusSession(newState);
        } catch (err) {
            console.error('Failed to toggle focus session:', err);
        }
    }, [isFocusSession]);

    return { isFocusSession, toggleFocus };
}
