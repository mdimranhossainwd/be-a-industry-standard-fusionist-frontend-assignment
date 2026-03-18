"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/types/api";
import { authService } from "@/lib/services";

export function useAuth(requiredRole?: "STUDENT" | "TUTOR" | "ADMIN") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/login");
          return;
        }

        const currentUser = authService.getCurrentUser();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          if (currentUser.role === "ADMIN") {
            router.push("/admin");
          } else if (currentUser.role === "TUTOR") {
            router.push("/tutor/dashboard");
          } else {
            router.push("/dashboard");
          }
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, requiredRole]);

  return { user, loading };
}
