// "use server";

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";

// const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (!BASE_API_URL) {
//   throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
// }

// export async function getUserInfo() {
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;
//     const sessionToken = cookieStore.get("better-auth.session_token")?.value;

//     if (!accessToken) return null;

//     const res = await fetch(`${BASE_API_URL}/auth/me`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
//       },
//       // প্রতিবার fresh data আনবে, cache করবে না
//       cache: "no-store",
//     });

//     if (!res.ok) return null;

//     const { data } = await res.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching user info:", error);
//     return null;
//   }
// }

// export async function logoutAction() {
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;
//     const sessionToken = cookieStore.get("better-auth.session_token")?.value;

//     // backend এ logout call করা (optional, backend এ endpoint থাকলে)
//     if (accessToken) {
//       await fetch(`${BASE_API_URL}/auth/logout`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
//         },
//       }).catch(() => {
//         // backend logout fail করলেও cookies delete করবো
//       });
//     }
//   } catch (error) {
//     console.error("Logout error:", error);
//   } finally {
//     // যাই হোক cookies delete করবেই
//     const cookieStore = await cookies();
//     cookieStore.delete("accessToken");
//     cookieStore.delete("refreshToken");
//     cookieStore.delete("better-auth.session_token");
//   }

//   redirect("/login");
// }
