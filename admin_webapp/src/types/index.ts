export type Role = 'admin' | 'manager' | 'employee';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    companyId: number;
    teamId?: number;
    createdAt: string;
}

export interface Team {
    id: number;
    name: string;
    companyId: number;
    createdAt: string;
}

export interface ActivityLog {
    id: number;
    userId: number;
    timestamp: string;
    keystrokes: number;
    mouseMoves: number;
    focusScore: number;
    category: string;
    windowTitle: string;
    imageUrl?: string;
    userName?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}
