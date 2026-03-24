// app/admin/ideas/page.tsx — RSC

import { getCategoriesAction } from "@/app/admin/categories/_action";
import { AdminIdeasClient } from "@/components/admin/admin-idea";
import { redirect } from "next/navigation";
import { getAdminIdeasAction } from "./_action";

export default async function AdminIdeasPage() {
  let initialIdeas;
  let categories;

  try {
    [initialIdeas, categories] = await Promise.all([
      getAdminIdeasAction({
        page: 1,
        limit: 10,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
      getCategoriesAction(),
    ]);
  } catch {
    redirect("/login");
  }

  return (
    <AdminIdeasClient initialIdeas={initialIdeas} categories={categories} />
  );
}
