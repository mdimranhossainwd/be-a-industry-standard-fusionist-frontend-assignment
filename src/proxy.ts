import { NextRequest, NextResponse } from "next/server";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/verify-email",
  "/ideas",
  "/all-ideas",
  "/payment/success",
  "/payment/cancel",
  "/payment/failed",
];

function isPublicPath(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cleanSearch = request.nextUrl.search
    .replace(/[?&]payment\/[^&]*/g, "")
    .replace(/^\?&/, "?");
  const pathWithQuery = `${pathname}${cleanSearch}`;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isPublic = isPublicPath(pathname);

  if (!accessToken && !refreshToken) {
    if (!isPublic) {
      return NextResponse.redirect(
        new URL(
          `/login?redirectPath=${encodeURIComponent(pathWithQuery)}`,
          request.url,
        ),
      );
    }
    return NextResponse.next();
  }

  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `refreshToken=${refreshToken}`,
        },
      });

      if (!res.ok) {
        if (!isPublic) {
          return NextResponse.redirect(
            new URL(
              `/login?redirectPath=${encodeURIComponent(pathWithQuery)}`,
              request.url,
            ),
          );
        }
        return NextResponse.next();
      }

      const { data } = await res.json();
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        token,
      } = data;

      const isAuthPage = pathname === "/login" || pathname === "/register";
      const redirectTo = isAuthPage ? "/dashboard" : pathWithQuery;

      const response = NextResponse.redirect(new URL(redirectTo, request.url));

      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      if (newAccessToken)
        response.cookies.set("accessToken", newAccessToken, cookieOpts);
      if (newRefreshToken)
        response.cookies.set("refreshToken", newRefreshToken, cookieOpts);
      if (token) {
        response.cookies.set("better-auth.session_token", token, {
          ...cookieOpts,
          maxAge: 24 * 60 * 60,
        });
      }

      return response;
    } catch {
      if (!isPublic) {
        return NextResponse.redirect(
          new URL(
            `/login?redirectPath=${encodeURIComponent(pathWithQuery)}`,
            request.url,
          ),
        );
      }
      return NextResponse.next();
    }
  }

  if (accessToken && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
