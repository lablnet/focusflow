import { api } from '../apis/wrapper';
import { useUserStore } from '../store/userStore';
import type { User } from '../types';

export const authService = {
    login: async (email: string, password: string) => {
        const data = await api.post<{ accessToken: string; refreshToken: string; user: User }>('/auth/login', {
            email,
            password,
        });

        useUserStore.getState().setSession({
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            user: data.user,
        });

        return data;
    },

    logout: () => {
        useUserStore.getState().logout();
    }
};
