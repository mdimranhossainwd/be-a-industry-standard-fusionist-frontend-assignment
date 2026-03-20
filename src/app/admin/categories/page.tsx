// app/admin-dashboard/categories/page.tsx — RSC

import { AdminCategoriesClient } from "@/components/admin/admin-categories";
import { redirect } from "next/navigation";
import { getCategoriesAction } from "./_action";

export default async function AdminCategoriesPage() {
  let categories;

  try {
    categories = await getCategoriesAction();
  } catch {
    redirect("/login");
  }

  return <AdminCategoriesClient initialCategories={categories} />;
}
