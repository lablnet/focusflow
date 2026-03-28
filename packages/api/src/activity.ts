import type { AxiosInstance } from 'axios';
import { ActivityLog } from '@focusflow/types';

export const activityActions = (client: AxiosInstance) => ({
    getLogs: async (params?: Record<string, any>) => {
        const { data } = await client.get<{ logs: ActivityLog[] }>('/activity', { params });
        return data;
    },

    getStats: async (userId: number) => {
        const { data } = await client.get(`/activity/stats/${userId}`);
        return data;
    },
});
