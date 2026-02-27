import { api } from '../apis/wrapper';
import type { ActivityLog } from '../types';

export const activityService = {
    getLogs: async (params?: Record<string, string>) => {
        return api.get<{ logs: ActivityLog[] }>('/activity', { params });
    }
};
