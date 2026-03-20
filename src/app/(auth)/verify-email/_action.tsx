/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";

export const verifyOtpAction = async (email: string, otp: string) => {
  try {
    await httpClient.post("/auth/verify-email", {
      email,
      otp,
    });

    // verify সফল হলে login page এ redirect, email prefill এর জন্য query তে দিচ্ছি
    redirect(`/login?email=${encodeURIComponent(email)}`);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: error?.response?.data?.message || "OTP verification failed",
    };
  }
};
