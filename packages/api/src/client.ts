import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// To be updated with real endpoint
const BASE_URL = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Helper to read token from Zustand storage
const getToken = (): string | null => {
    if (typeof localStorage === 'undefined') return null;
    try {
        const saved = localStorage.getItem('focusflow-auth-storage');
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        return parsed.state?.access_token || null;
    } catch (e) {
        return null;
    }
};

export const createClient = (tokenGetter: () => string | null = getToken): AxiosInstance => {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = tokenGetter();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return client;
};

// Global default client that reads from localStorage via the persistent store
export const api = createClient();
