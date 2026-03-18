import api from "@/lib/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/api";
import { removeAuthToken, setAuthToken } from "@/utils/auth";

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data, {
      skipAutoRedirect: true,
    });

    console.log("✅ Register response:", response); // ✅ Debug
    return response;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data, {
      skipAutoRedirect: true,
      credentials: "include",
    });

    console.log("✅ Login response:", response); // ✅ Debug

    // ✅ সরাসরি response use করুন
    if (response && response.user) {
      if (response.token) {
        localStorage.setItem("token", response.token);
        setAuthToken(response.token);
        console.log("💾 Token saved:", response.token); // ✅ Debug
      }
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    }

    throw new Error("Invalid server response");
  },

  async getProfile(): Promise<User> {
    console.log("🔍 Getting profile..."); // ✅ Debug

    const response = await api.get<User>("/auth/me");

    console.log("📥 Profile response:", response); // ✅ Debug

    return response; // ✅ সরাসরি return করুন (response.data! না)
  },

  async logout() {
    try {
      removeAuthToken();
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  },

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token") || !!localStorage.getItem("user");
  },
};
