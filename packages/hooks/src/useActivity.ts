import { useState, useCallback } from 'react';
import type { ActivityLog } from '@focusflow/types';
import { activityActions } from '@focusflow/api';

export const useActivity = () => {
    const [loading, setLoading] = useState(false);

    const getLogs = useCallback(async (params?: Record<string, any>) => {
        setLoading(true);
        try {
            return await activityActions().getLogs(params);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        getLogs,
    };
};
