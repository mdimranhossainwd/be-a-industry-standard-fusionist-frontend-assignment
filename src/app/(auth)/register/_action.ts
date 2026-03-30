/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { redirect } from "next/navigation";
import z from "zod";

const registerZodSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["MEMBER", "ADMIN"]).default("MEMBER"),
});

export const registerAction = async (
  payload: z.infer<typeof registerZodSchema>,
) => {
  const parsed = registerZodSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message || "Invalid input",
    };
  }

  try {
    await httpClient.post("/auth/register", parsed.data);

    redirect(`/login?email=${encodeURIComponent(parsed.data.email)}`);
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: error?.response?.data?.message || "Registration failed",
    };
  }
};
