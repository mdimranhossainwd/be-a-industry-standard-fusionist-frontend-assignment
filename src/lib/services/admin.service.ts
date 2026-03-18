import api from "@/lib/api";
import type { Booking, User } from "@/types/api";

export interface AdminUserSummary extends Pick<
  User,
  "id" | "name" | "email" | "role" | "createdAt"
> {
  tutorProfile?: {
    id: string;
    bio?: string | null;
    hourlyRate: number;
    subjects: string[];
  } | null;
}

export type AdminBookingSummary = Booking;

export interface PlatformStatistics {
  totalUsers: number;
  totalStudents: number;
  totalTutors: number;
  totalBookings: number;
  totalCompletedBookings: number;
  totalCategories: number;
  recentBookings: Array<{
    id: string;
    student: { id: string; name: string };
    tutor: { id: string; name: string };
    createdAt: string;
  }>;
}

export const adminService = {
  async getStatistics(): Promise<PlatformStatistics> {
    const res = await api.get<PlatformStatistics>("/admins/statistics");
    return res;
  },

  async getUsers(params?: {
    role?: "STUDENT" | "TUTOR" | "ADMIN";
    search?: string;
  }): Promise<AdminUserSummary[]> {
    const res = await api.get<AdminUserSummary[]>("/admins/users", {
      params,
    });
    return res || [];
  },

  async getBookings(params?: {
    status?: string;
    tutorId?: string;
    studentId?: string;
  }): Promise<AdminBookingSummary[]> {
    const res = await api.get<AdminBookingSummary[]>("/admins/bookings", {
      params,
    });
    return res || [];
  },

  async updateUserStatus(
    id: string,
    status: string,
  ): Promise<AdminUserSummary> {
    const res = await api.patch<AdminUserSummary>(
      `/admins/users/${id}/status`,
      {
        status,
      },
    );
    return res;
  },
};
