"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { PaginatedIdeas } from "@/types/api.types";
import { revalidatePath } from "next/cache";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

// ─── Query params ─────────────────────────────────────────────────────────────

export interface AdminIdeaQueryParams {
  page?: number;
  limit?: number;
  status?: "DRAFT" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "ALL";
  search?: string;
  category?: string; // category slug
  authorId?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "status";
  sortOrder?: "asc" | "desc";
}

// ─── Get all ideas (admin) ────────────────────────────────────────────────────

export async function getAdminIdeasAction(
  params: AdminIdeaQueryParams = {},
): Promise<PaginatedIdeas> {
  const {
    page = 1,
    limit = 10,
    status,
    search,
    category,
    authorId,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = params;

  const res = await httpClient.get<PaginatedIdeas>("/ideas/admin/all", {
    params: {
      page,
      limit,
      sortBy,
      sortOrder,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(category ? { category } : {}),
      ...(authorId ? { authorId } : {}),
    },
  });

  return unwrap(res);
}

// ─── Approve idea ─────────────────────────────────────────────────────────────

export async function approveIdeaAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid idea ID" };

  try {
    await httpClient.patch(`/ideas/${id}/status`, { status: "APPROVED" });
    revalidatePath("/admin/ideas");
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
  if (!id) return { success: false, error: "Invalid idea ID" };
  if (!rejectionFeedback?.trim()) {
    return { success: false, error: "Rejection feedback is required" };
  }

  try {
    await httpClient.patch(`/ideas/${id}/status`, {
      status: "REJECTED",
      rejectionFeedback: rejectionFeedback.trim(),
    });
    revalidatePath("/admin/ideas");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to reject idea";
    return { success: false, error: message };
  }
}

// ─── Delete idea (admin can delete any) ──────────────────────────────────────

export async function deleteIdeaAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid idea ID" };

  try {
    await httpClient.delete(`/ideas/${id}`);
    revalidatePath("/admin/ideas");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete idea";
    return { success: false, error: message };
  }
}

// ─── Toggle highlight ─────────────────────────────────────────────────────────

export async function toggleHighlightAction(
  id: string,
  isHighlighted: boolean,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid idea ID" };

  try {
    await httpClient.patch(`/ideas/${id}/highlight`, { isHighlighted });
    revalidatePath("/admin/ideas");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update highlight";
    return { success: false, error: message };
  }
}
