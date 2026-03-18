import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    NEXT_PUBLIC_BACKEND_URL: z.string().url()
  },

  client: {
    NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
});
