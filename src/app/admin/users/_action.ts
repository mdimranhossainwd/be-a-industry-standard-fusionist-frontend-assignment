/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "MEMBER" | "ADMIN";
export type UserStatus = "ACTIVE" | "BLOCKED";

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  _count?: {
    ideas?: number;
  };
}

export interface GetUsersParams {
  role?: UserRole;
  search?: string;
  status?: UserStatus;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// Backend may return: array directly, { data: [] }, or { data: { data: [] } }
// This helper safely extracts the array from any nesting level.
function unwrap<T>(res: any): T {
  if (Array.isArray(res)) return res as T;
  if (Array.isArray(res?.data)) return res.data as T;
  if (Array.isArray(res?.data?.data)) return res.data.data as T;
  return res?.data ?? res;
}

// ─── Get all users ────────────────────────────────────────────────────────────

export async function getUsersAction(
  params: GetUsersParams = {},
): Promise<AdminUserSummary[]> {
  const query = new URLSearchParams();
  if (params.role) query.set("role", params.role);
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const url = `/users${query.toString() ? `?${query.toString()}` : ""}`;
  const res = await httpClient.get(url);
  const data = unwrap<AdminUserSummary[]>(res);
  // Final safety — always return an array
  return Array.isArray(data) ? data : [];
}

// ─── Get user by ID ───────────────────────────────────────────────────────────

export async function getUserByIdAction(
  userId: string,
): Promise<AdminUserSummary | null> {
  try {
    const res = await httpClient.get<AdminUserSummary>(`/users/${userId}`);
    return unwrap(res);
  } catch {
    return null;
  }
}

// ─── Update user role ─────────────────────────────────────────────────────────

export async function updateUserRoleAction(
  userId: string,
  role: UserRole,
): Promise<ActionResult> {
  try {
    await httpClient.patch(`/users/${userId}/role`, { role });
    return { success: true, data: undefined };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Failed to update role";
    return { success: false, error: message };
  }
}

// ─── Update user status (ACTIVE / BLOCKED) ───────────────────────────────────────

export async function updateUserStatusAction(
  userId: string,
  status: UserStatus,
): Promise<ActionResult> {
  try {
    await httpClient.patch(`/users/${userId}/status`, { status });
    return { success: true, data: undefined };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Failed to update status";
    return { success: false, error: message };
  }
}

// ─── Delete user ──────────────────────────────────────────────────────────────

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  try {
    await httpClient.delete(`/users/${userId}`);
    return { success: true, data: undefined };
  } catch (err: any) {
    const message =
      err?.response?.data?.message ?? err?.message ?? "Failed to delete user";
    return { success: false, error: message };
  }
}
