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

export interface Session {
    user: User | null;
    access_token: string | null;
    refresh_token: string | null;
}

export interface AuthState extends Session {
    isAuthenticated: boolean;
    loading: boolean;
}
