import { useUserStore } from "../store/userStore";
import { backendApiURL } from "../constants/urls";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function apiRequestRaw(
    endpoint: string,
    options: RequestOptions = {}
): Promise<Response> {
    const { params, ...init } = options;
    const session = useUserStore.getState().session;
    const token = session?.access_token;

    const url = new URL(`${backendApiURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const headers = new Headers(init.headers);
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    let response = await fetch(url.toString(), { ...init, headers });

    // Handle Token Refresh logic
    if (response.status === 401 && session?.refresh_token) {
        try {
            const refreshResponse = await fetch(`${backendApiURL}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: session.refresh_token }),
            });

            if (refreshResponse.ok) {
                const data = await refreshResponse.json();
                useUserStore.getState().setSession({
                    ...session,
                    access_token: data.accessToken,
                });

                // Retry original request
                headers.set("Authorization", `Bearer ${data.accessToken}`);
                response = await fetch(url.toString(), { ...init, headers });
            } else {
                useUserStore.getState().logout();
                // Optionally redirect to login
            }
        } catch (error) {
            useUserStore.getState().logout();
        }
    }

    return response;
}

export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const response = await apiRequestRaw(endpoint, options);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { error: response.statusText };
        }
        throw new Error(errorData.error || errorData.message || "An error occurred");
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "POST",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: "PUT",
            body: body instanceof FormData ? body : JSON.stringify(body),
        }),
    delete: <T>(endpoint: string, options?: RequestOptions) =>
        apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
    getText: async (endpoint: string, options?: RequestOptions): Promise<string> => {
        const response = await apiRequestRaw(endpoint, { ...options, method: "GET" });
        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: response.statusText };
            }
            throw new Error(errorData.error || errorData.message || "An error occurred");
        }
        return response.text();
    },
    stream: (endpoint: string, options?: RequestOptions): Promise<Response> =>
        apiRequestRaw(endpoint, { ...options, method: "GET" }),
};
