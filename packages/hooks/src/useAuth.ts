import { useCallback } from 'react';
import { useAuthStore } from '@focusflow/stores';
import { authActions } from '@focusflow/api';

export const useAuth = () => {
    const setSession = useAuthStore((state) => state.setSession);
    const setLoading = useAuthStore((state) => state.setLoading);
    const logoutStore = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.access_token);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const loading = useAuthStore((state) => state.loading);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const session = await authActions().login(email, password);
            setSession(session);
            return session;
        } finally {
            setLoading(false);
        }
    }, [setSession, setLoading]);

    const logout = useCallback(async () => {
        try {
            await authActions().logout();
        } catch (e) {
            console.error('Logout failed', e);
        } finally {
            logoutStore();
        }
    }, [logoutStore]);

    return {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
    };
};
