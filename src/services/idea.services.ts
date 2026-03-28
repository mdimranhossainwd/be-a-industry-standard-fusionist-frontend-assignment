// SERVER-SIDE ONLY — do not import in "use client" components
// Uses your existing httpClient which reads cookies() from next/headers

import {
  CreateIdeaPayload,
  Idea,
  IdeaListParams,
  MemberDashboardStats,
  PaginatedIdeas,
  UpdateIdeaPayload,
} from "@/types/dashboard";

// ─── Helper: unwrap { success, message, data } envelope ──────────────────────

function unwrap<T>(response: { data: T }): T {
  return response.data;
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export async function getMemberDashboardStats(): Promise<MemberDashboardStats> {
  const res = await httpClient.get<MemberDashboardStats>(
    "/dashboard/member/stats",
  );
  return unwrap(res);
}

// ─── Member idea list ─────────────────────────────────────────────────────────

export async function getMyIdeas(
  params: IdeaListParams = {},
): Promise<PaginatedIdeas> {
  const { page = 1, limit = 10, status, search } = params;
  const res = await httpClient.get<PaginatedIdeas>("/ideas/me/list", {
    params: {
      page,
      limit,
      ...(status && status !== "ALL" ? { status } : {}),
      ...(search ? { search } : {}),
    },
  });
  return unwrap(res);
}

// ─── Single idea ──────────────────────────────────────────────────────────────

export async function getIdeaById(id: string): Promise<Idea> {
  const res = await httpClient.get<Idea>(`/ideas/${id}`);
  return unwrap(res);
}

// ─── Create idea ──────────────────────────────────────────────────────────────

export async function createIdea(payload: CreateIdeaPayload): Promise<Idea> {
  const res = await httpClient.post<Idea>("/ideas", payload);
  return unwrap(res);
}

// ─── Update idea ──────────────────────────────────────────────────────────────

export async function updateIdea(
  id: string,
  payload: UpdateIdeaPayload,
): Promise<Idea> {
  const res = await httpClient.patch<Idea>(`/ideas/${id}`, payload);
  return unwrap(res);
}

// ─── Delete idea ──────────────────────────────────────────────────────────────

export async function deleteIdea(id: string): Promise<void> {
  await httpClient.delete(`/ideas/${id}`);
}

// ─── Submit idea for review ───────────────────────────────────────────────────

export async function submitIdeaForReview(id: string): Promise<Idea> {
  const res = await httpClient.patch<Idea>(`/ideas/${id}/submit`, {});
  return unwrap(res);
}
