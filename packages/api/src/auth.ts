import { AxiosInstance } from 'axios';
import { User, Session } from '@focusflow/types';

export const authActions = (client: AxiosInstance) => ({
    login: async (email: string, password: string): Promise<Session> => {
        const { data } = await client.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
            email,
            password,
        });
        return {
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            user: data.user,
        };
    },

    register: async (userData: any): Promise<Session> => {
        const { data } = await client.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/register', userData);
        return {
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            user: data.user,
        };
    },

    logout: async () => {
        await client.post('/auth/logout');
    },

    refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
        const { data } = await client.post<{ accessToken: string }>('/auth/refresh', {
            refreshToken,
        });
        return data;
    },

    getMe: async (): Promise<User> => {
        const { data } = await client.get<{ data: User }>('/auth/me');
        return data.data;
    },
});
