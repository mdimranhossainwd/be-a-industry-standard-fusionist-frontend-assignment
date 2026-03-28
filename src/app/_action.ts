"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { IdeaProfile } from "@/types/api.types";

export interface VoteSummary {
  upvotes: number;
  downvotes: number;
  userVote: "UPVOTE" | "DOWNVOTE" | null;
}

export interface CommentPayload {
  content: string;
  parentId?: string;
}

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

export async function getIdeasAction(): Promise<IdeaProfile[]> {
  const res = await httpClient.get<IdeaProfile[]>("/ideas");
  return unwrap(res);
}

export async function getIdeaByIdAction(
  idOrSlug: string,
): Promise<IdeaProfile | null> {
  try {
    const res = await httpClient.get<IdeaProfile>(`/ideas/${idOrSlug}`);
    return unwrap(res);
  } catch {
    return null;
  }
}

// Get votes
export async function getVotesAction(ideaId: string): Promise<VoteSummary> {
  const res = await httpClient.get<VoteSummary>(`/votes/${ideaId}`);
  return unwrap(res);
}

// Add vote
export async function createVoteAction(
  ideaId: string,
  type: "UPVOTE" | "DOWNVOTE",
) {
  const res = await httpClient.post(`/votes/${ideaId}`, { type });
  return unwrap(res);
}

// Remove vote
export async function deleteVoteAction(ideaId: string) {
  const res = await httpClient.delete(`/votes/${ideaId}`);
  return unwrap(res);
}

// Create comment
export async function createCommentAction(
  ideaId: string,
  payload: CommentPayload,
) {
  const res = await httpClient.post(`/comments/${ideaId}`, payload);
  return unwrap(res);
}

// Delete comment
export async function deleteCommentAction(commentId: string) {
  const res = await httpClient.delete(`/comments/${commentId}`);
  return unwrap(res);
}

// Create checkout session
export async function createPaymentSessionAction(ideaId: string) {
  const res = await httpClient.post<{ url: string }>("/payments", {
    ideaId,
  });
  return unwrap(res);
}

// export async function getIdeaByIdAction(
//   idOrSlug: string,
// ): Promise<IdeaProfile | null> {
//   try {
//     // আগের httpClient এর বদলে plain axios — cookie পাঠাবে না
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/ideas/${idOrSlug}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     const data = await res.json();
//     return data?.data ?? null;
//   } catch {
//     return null;
//   }
// }
