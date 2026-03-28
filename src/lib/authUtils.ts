export type UserRole = "MEMBER" | "ADMIN";

export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    default:
      return "/dashboard";
  }
};

export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole,
): boolean => {
  if (role === "ADMIN") return true; // admin সব জায়গায় যেতে পারবে
  if (redirectPath.startsWith("/admin")) return false; // member admin route এ যেতে পারবে না
  return true;
};
