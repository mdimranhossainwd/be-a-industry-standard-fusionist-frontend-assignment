"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { getUserInfo } from "@/services/auth.services";
import { MemberDashboardStats } from "@/types/api.types";
import {} from "@/types/dashboard.types";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

// ─── Get current user ─────────────────────────────────────────────────────────

export async function getCurrentUserAction() {
  return getUserInfo();
}

// ─── Get member dashboard stats ───────────────────────────────────────────────

export async function getMemberStatsAction(): Promise<MemberDashboardStats> {
  const res = await httpClient.get<MemberDashboardStats>("/stats");
  return unwrap(res);
}
