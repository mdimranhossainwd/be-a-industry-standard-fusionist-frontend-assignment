// app/ideas/page.tsx
// ✅ Server Component — no "use client"

import { getIdeasAction } from "../_action";
import { getCategoriesAction } from "../admin/categories/_action";
import { AllIdeasClient } from "./_components/all-ideas-client";

export default async function AllIdeasPage() {
  const [ideas, categories] = await Promise.all([
    getIdeasAction(),
    getCategoriesAction(),
  ]);

  return (
    <AllIdeasClient
      initialIdeas={ideas ?? []}
      initialCategories={categories ?? []}
    />
  );
}
