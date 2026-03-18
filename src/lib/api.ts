import { env } from "./env";

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export interface ApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  skipAutoRedirect?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean>,
  ): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private async handleResponse<T>(
    response: Response,
    config?: RequestConfig,
  ): Promise<T> {
    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      payload = {};
    }

    if (!response.ok) {
      if (response.status === 401 && !config?.skipAutoRedirect) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }

      const maybeObj = payload as {
        message?: string;
        error?: { message?: string };
      };
      throw new Error(
        maybeObj?.message ||
          maybeObj?.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
      );
    }

    // unwrap { data } if present, otherwise return payload directly
    const maybeResponseObj = payload as { data?: unknown } | unknown;
    if (
      maybeResponseObj &&
      typeof maybeResponseObj === "object" &&
      "data" in maybeResponseObj
    ) {
      // @ts-ignore
      return (maybeResponseObj as any).data as T;
    }

    return payload as T;
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<T> {  // ✅ Changed
    const url = this.buildURL(endpoint, config?.params);
    const token = this.getAuthToken();

    console.log("📤 GET:", url);  // ✅ Debug log
    console.log("🎫 Token:", token ? "Present ✅" : "Missing ❌");  // ✅ Debug log

    const response = await fetch(url, {
      method: "GET",
      ...config,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
    });

    return this.handleResponse<T>(response, config);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {  // ✅ Changed
    const url = this.buildURL(endpoint, config?.params);
    const token = this.getAuthToken();

    console.log("📤 POST:", url);  // ✅ Debug log

    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });

    return this.handleResponse<T>(response, config);
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {  // ✅ Changed
    const url = this.buildURL(endpoint, config?.params);
    const token = this.getAuthToken();

    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });

    return this.handleResponse<T>(response, config);
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: RequestConfig,
  ): Promise<T> {  // ✅ Changed
    const url = this.buildURL(endpoint, config?.params);
    const token = this.getAuthToken();

    const response = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...config,
    });

    return this.handleResponse<T>(response, config);
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig,
  ): Promise<T> {  // ✅ Changed
    const url = this.buildURL(endpoint, config?.params);
    const token = this.getAuthToken();

    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...config?.headers,
      },
      ...config,
    });

    return this.handleResponse<T>(response, config);
  }
}

const api = new ApiClient(API_URL);

export default api;
export type { ApiClient };
