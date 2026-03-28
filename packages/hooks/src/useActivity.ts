import { useState, useCallback } from 'react';
import type { ActivityLog } from '@focusflow/types';
import { activityActions } from '@focusflow/api';
import { useAPI } from './useAPI';

export const useActivity = () => {
    const client = useAPI();
    const [loading, setLoading] = useState(false);

    const getLogs = useCallback(async (params?: Record<string, any>) => {
        setLoading(true);
        try {
            return await activityActions(client).getLogs(params);
        } finally {
            setLoading(false);
        }
    }, [client]);

    return {
        loading,
        getLogs,
    };
};
