"use server";

import { cookies } from "next/headers";

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set("token", token);
};

export const removeAuthToken = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
};


