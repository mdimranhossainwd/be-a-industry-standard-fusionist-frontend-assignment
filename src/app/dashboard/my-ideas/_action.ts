"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Idea, IdeaListParams, PaginatedIdeas } from "@/types/api.types";
import { revalidatePath } from "next/cache";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

// ─── Get member's own ideas (paginated) ───────────────────────────────────────

export async function getMyIdeasAction(
  params: IdeaListParams = {},
): Promise<PaginatedIdeas> {
  const { page = 1, limit = 10, status, search } = params;

  const res = await httpClient.get<PaginatedIdeas>("/ideas/me/list", {
    params: {
      page,
      limit,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
  });

  return unwrap(res);
}

// ─── Delete idea ──────────────────────────────────────────────────────────────

export async function deleteIdeaAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid idea ID" };

  try {
    await httpClient.delete(`/ideas/${id}`);
    revalidatePath("/dashboard/my-ideas");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete idea";
    return { success: false, error: message };
  }
}

// ─── Submit idea for review ───────────────────────────────────────────────────

export async function submitIdeaAction(
  id: string,
): Promise<{ success: true; data: Idea } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid idea ID" };

  try {
    const res = await httpClient.patch<Idea>(`/ideas/${id}/submit`, {});
    const idea = unwrap(res);
    revalidatePath("/dashboard/my-ideas");
    revalidatePath("/dashboard");
    return { success: true, data: idea };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to submit idea";
    return { success: false, error: message };
  }
}
