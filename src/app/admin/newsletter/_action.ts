/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Subscriber {
  id: string;
  email: string;
  isVerified: boolean;
  subscribedAt: string;
  userId: string | null;
  user: { name: string } | null;
}

export interface SubscriberMeta {
  total: number;
  verified: number;
  unverified: number;
}

export interface NewsletterLog {
  id: string;
  sentAt: string;
  totalSent: number;
  subject: string;
  status: "SUCCESS" | "PARTIAL" | "FAILED";
}

// ─── Create subscriber ────────────────────────────────────────────────────────

export const createSubscriberAction = async (email: string) => {
  try {
    await httpClient.post("/newsletter/subscribe", { email });
    // revalidatePath("/admin/newsletter");
    return { success: true, message: "Subscriber added!" };
  } catch (error) {
    return { success: false, message: "Failed to add subscriber." };
  }
};

// ─── Get all subscribers ──────────────────────────────────────────────────────

export const getSubscribersAction = async () => {
  try {
    const res = await httpClient.get<{
      data: Subscriber[];
      meta: SubscriberMeta;
    }>("/newsletter/subscribers");

    return {
      success: true,
      subscribers: res.data as unknown as Subscriber[],
      meta: (res as any).meta as SubscriberMeta,
    };
  } catch (error: unknown) {
    return {
      success: false,
      subscribers: [],
      meta: { total: 0, verified: 0, unverified: 0 },
    };
  }
};

// ─── Get newsletter logs ──────────────────────────────────────────────────────

export const getNewsletterLogsAction = async () => {
  try {
    const res = await httpClient.get<NewsletterLog[]>("/newsletter/logs");
    return {
      success: true,
      logs: res.data as unknown as NewsletterLog[],
    };
  } catch (error: unknown) {
    return { success: false, logs: [] };
  }
};

// ─── Trigger newsletter ───────────────────────────────────────────────────────

export const triggerNewsletterAction = async () => {
  try {
    await httpClient.post("/newsletter/trigger", {});
    revalidatePath("/admin/newsletter");
    return { success: true, message: "Newsletter triggered successfully!" };
  } catch (error) {
    return { success: false, message: "Failed to trigger newsletter." };
  }
};

// ─── Verify subscriber ────────────────────────────────────────────────────────

export const verifySubscriberAction = async (email: string) => {
  try {
    await httpClient.post("/newsletter/verify", { email });
    revalidatePath("/admin/newsletter");
    return { success: true, message: "Subscriber verified!" };
  } catch (error) {
    return { success: false, message: "Failed to verify subscriber." };
  }
};

// ─── Delete / unsubscribe ─────────────────────────────────────────────────────

export const unsubscribeAction = async (email: string) => {
  try {
    await httpClient.post("/newsletter/unsubscribe", { email });
    revalidatePath("/admin/newsletter");
    return { success: true, message: "Subscriber removed!" };
  } catch (error) {
    return { success: false, message: "Failed to remove subscriber." };
  }
};
