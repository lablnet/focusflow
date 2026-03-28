import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// To be updated with real endpoint
const BASE_URL = import.meta.env?.VITE_API_URL || 'http://127.0.0.1:8000/api';

export const createClient = (getToken: () => string | null): AxiosInstance => {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

    return client;
};

// Global default client if needed, though stores will usually provide their own instance with token getter
export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
