"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Category, CreateIdeaPayload, Idea } from "@/types/api.types";
import {
  createIdeaZodSchema,
  updateIdeaZodSchema,
} from "@/zod/idea.validation";
import { revalidatePath } from "next/cache";

// ─── Helper ───────────────────────────────────────────────────────────────────

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

// ─── Get categories (RSC prefetch) ────────────────────────────────────────────

export async function getCategoriesAction(): Promise<Category[]> {
  const res = await httpClient.get<Category[]>("/categories");
  return unwrap(res);
}

// ─── Create idea ──────────────────────────────────────────────────────────────

export async function createIdeaAction(
  payload: CreateIdeaPayload,
): Promise<{ success: true; data: Idea } | { success: false; error: string }> {
  // Server-side validation — same pattern as loginAction
  const parsed = createIdeaZodSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const res = await httpClient.post<Idea>("/ideas", parsed.data);
    const idea = unwrap(res);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-ideas");
    return { success: true, data: idea };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create idea";
    return { success: false, error: message };
  }
}

// ─── Update idea ──────────────────────────────────────────────────────────────

export async function updateIdeaAction(
  id: string,
  payload: Partial<CreateIdeaPayload>,
): Promise<{ success: true; data: Idea } | { success: false; error: string }> {
  // Partial validation for updates
  const parsed = updateIdeaZodSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { success: false, error: firstError };
  }

  try {
    const res = await httpClient.patch<Idea>(`/ideas/${id}`, parsed.data);
    const idea = unwrap(res);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-ideas");
    return { success: true, data: idea };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update idea";
    return { success: false, error: message };
  }
}

// ─── Submit for review ────────────────────────────────────────────────────────

export async function submitIdeaForReviewAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid idea ID" };
  }

  try {
    await httpClient.patch(`/ideas/${id}/submit`, {});
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-ideas");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to submit idea";
    return { success: false, error: message };
  }
}
