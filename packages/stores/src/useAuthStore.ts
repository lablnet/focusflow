import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Session, User } from '@focusflow/types';

interface AuthActions {
    setSession: (session: Session | null) => void;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set) => ({
            user: null,
            access_token: null,
            refresh_token: null,
            isAuthenticated: false,
            loading: false,

            setSession: (session) =>
                set({
                    user: session?.user ?? null,
                    access_token: session?.access_token ?? null,
                    refresh_token: session?.refresh_token ?? null,
                    isAuthenticated: !!session?.access_token,
                }),

            setUser: (user) => set({ user }),

            setLoading: (loading) => set({ loading }),

            logout: () =>
                set({
                    user: null,
                    access_token: null,
                    refresh_token: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'focusflow-auth-storage',
        }
    )
);
