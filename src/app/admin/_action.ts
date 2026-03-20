"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";
import { AdminDashboardStats, PaginatedIdeas } from "@/types/api.types";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

// ─── Get current user (reuse existing) ───────────────────────────────────────

export async function getAdminUserAction() {
  return getUserInfo();
}

// ─── Get admin stats ──────────────────────────────────────────────────────────

export async function getAdminStatsAction(): Promise<AdminDashboardStats> {
  const res = await httpClient.get<AdminDashboardStats>("/stats");
  return unwrap(res);
}

// ─── Get pending review ideas ─────────────────────────────────────────────────

export async function getPendingIdeasAction(
  page = 1,
  limit = 8,
): Promise<PaginatedIdeas> {
  const res = await httpClient.get<PaginatedIdeas>("/ideas/admin/all", {
    params: { status: "UNDER_REVIEW", page, limit },
  });
  return unwrap(res);
}

// ─── Approve idea ─────────────────────────────────────────────────────────────

export async function approveIdeaAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await httpClient.patch(`/ideas/${id}/status`, { status: "APPROVED" });
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to approve idea";
    return { success: false, error: message };
  }
}

// ─── Reject idea ──────────────────────────────────────────────────────────────

export async function rejectIdeaAction(
  id: string,
  rejectionFeedback: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await httpClient.patch(`/ideas/${id}/status`, {
      status: "REJECTED",
      rejectionFeedback,
    });
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reject idea";
    return { success: false, error: message };
  }
}
