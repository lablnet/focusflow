import type { AxiosInstance } from 'axios';
import { ActivityLog } from '@focusflow/types';
import { api } from './client';

export const activityActions = (client: AxiosInstance = api) => ({
    getLogs: async (params?: Record<string, any>) => {
        const { data } = await client.get<{ logs: ActivityLog[] }>('/activity', { params });
        return data;
    },

    getStats: async (userId: number) => {
        const { data } = await client.get(`/activity/stats/${userId}`);
        return data;
    },

    saveLog: async (logData: any): Promise<ActivityLog> => {
        const { data } = await client.post<{ data: ActivityLog }>('/activity', logData);
        return data.data;
    },
});

