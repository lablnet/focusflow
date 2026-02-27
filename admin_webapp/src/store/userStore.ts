import { create } from 'zustand';
import type { User } from '../types';

interface Session {
    access_token: string;
    refresh_token: string;
    user: User;
}

interface UserStore {
    session: Session | null;
    setSession: (session: Session | null) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
    session: JSON.parse(localStorage.getItem('session') || 'null'),
    setSession: (session) => {
        localStorage.setItem('session', JSON.stringify(session));
        set({ session });
    },
    logout: () => {
        localStorage.removeItem('session');
        set({ session: null });
    },
}));
