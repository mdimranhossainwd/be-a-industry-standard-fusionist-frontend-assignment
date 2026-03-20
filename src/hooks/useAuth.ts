"use client";

import { getUserInfo } from "@/services/auth.services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  image?: string;
  emailVerified: boolean;
  status: string;
  isDeleted: boolean;
};

const getDashboardRoute = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
};

export function useAuth(requiredRole?: "MEMBER" | "ADMIN") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getUserInfo();

        if (!currentUser) {
          router.push("/login");
          return;
        }

        if (requiredRole && currentUser.role !== requiredRole) {
          router.push(getDashboardRoute(currentUser.role));
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
