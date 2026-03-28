import { useCallback } from 'react';
import { useAuthStore } from '@focusflow/stores';
import { authActions } from '@focusflow/api';
import { useAPI } from './useAPI';

export const useAuth = () => {
    const client = useAPI();
    const setSession = useAuthStore((state) => state.setSession);
    const setLoading = useAuthStore((state) => state.setLoading);
    const logoutStore = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loading = useAuthStore((state) => state.loading);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const session = await authActions(client).login(email, password);
            setSession(session);
            return session;
        } finally {
            setLoading(false);
        }
    }, [client, setSession, setLoading]);

    const logout = useCallback(async () => {
        try {
            await authActions(client).logout();
        } catch (e) {
            console.error('Logout failed', e);
        } finally {
            logoutStore();
        }
    }, [client, logoutStore]);

    return {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };
};
