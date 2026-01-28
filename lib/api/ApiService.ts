/**
 * @file ApiService.ts
 * @description Advanced Generic API Service with Retry Logic, Timeouts, and Robust Error Handling.
 * Designed to prevent frontend crashes even when the backend is unreachable.
 */

export interface ApiConfig {
    baseUrl: string;
    timeout: number;
    maxRetries: number;
}

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number | null;
    success: boolean;
}

export class ApiError extends Error {
    constructor(public status: number, public detail: string, public code?: string) {
        super(`API Error ${status}: ${detail}`);
        this.name = 'ApiError';
    }
}

class ApiService {
    private config: ApiConfig;

    constructor() {
        this.config = {
            baseUrl: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, ''),
            timeout: 15000, // 15 seconds default timeout
            maxRetries: 2,
        };
    }

    /**
     * Helper to wait for a specified duration (used in retries)
     */
    private sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Core request engine with retry and timeout logic
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        retryCount = 0
    ): Promise<ApiResponse<T>> {
        const { baseUrl, timeout, maxRetries } = this.config;
        const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        // Setup Timeout Signal
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle successful but non-json responses (like 204 No Content)
            if (response.status === 204) {
                return { data: {} as T, error: null, status: 204, success: true };
            }

            // Handle Errors (4xx, 5xx)
            if (!response.ok) {
                // Retry logic for 5xx errors or network issues (only for idempotent methods)
                const isIdempotent = ['GET', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'].includes(options.method || 'GET');
                if (response.status >= 500 && isIdempotent && retryCount < maxRetries) {
                    await this.sleep(1000 * (retryCount + 1)); // Exponential-ish backoff
                    return this.request<T>(endpoint, options, retryCount + 1);
                }

                let errorMessage = response.statusText;
                try {
                    const errorData = await response.json();
                    const detail = errorData.detail || errorData.message;

                    if (typeof detail === 'string') {
                        errorMessage = detail;
                    } else if (Array.isArray(detail)) {
                        // Handle generic Pydantic errors (array of objects)
                        errorMessage = detail
                            .map((err: any) => err.msg || JSON.stringify(err))
                            .join('; ');
                    } else if (typeof detail === 'object' && detail !== null) {
                        // Handle other object errors
                        errorMessage = JSON.stringify(detail);
                    }
                } catch {
                    // If not JSON, try text
                    const text = await response.text();
                    if (text) errorMessage = text.substring(0, 100);
                }

                // FINAL SAFETY CHECK: Ensure errorMessage is a primitive string
                if (typeof errorMessage !== 'string') {
                    errorMessage = JSON.stringify(errorMessage);
                }

                return {
                    data: null,
                    error: errorMessage,
                    status: response.status,
                    success: false,
                };
            }

            // Handle Binary Data (PDFs, etc.)
            const contentType = response.headers.get('Content-Type');
            if (contentType && (contentType.includes('application/pdf') || contentType.includes('octet-stream'))) {
                const blob = await response.blob();
                return { data: blob as unknown as T, error: null, status: response.status, success: true };
            }

            // Parse JSON success
            const data = await response.json();
            return {
                data,
                error: null,
                status: response.status,
                success: true,
            };

        } catch (error: any) {
            clearTimeout(timeoutId);

            // Distinguish between timeout and other connection errors
            let errorMessage = 'An unknown connection error occurred.';
            let status = 0;

            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. The server is taking too long to respond.';
                status = 408;
            } else if (!window.navigator.onLine) {
                errorMessage = 'Internet disconnection detected. Please check your network.';
            } else {
                errorMessage = error.message || 'Could not connect to the backend server.';
            }

            // Retry on network errors
            const isIdempotent = ['GET', 'PUT', 'DELETE'].includes(options.method || 'GET');
            if (isIdempotent && retryCount < maxRetries && error.name !== 'AbortError') {
                await this.sleep(1000 * (retryCount + 1));
                return this.request<T>(endpoint, options, retryCount + 1);
            }

            return {
                data: null,
                error: errorMessage,
                status: status || 503,
                success: false,
            };
        }
    }

    /**
     * Public API Methods
     */

    async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(endpoint: string, body?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }
}

export const apiService = new ApiService();
