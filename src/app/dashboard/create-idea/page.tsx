// app/dashboard/create-idea/page.tsx — RSC

import { CreateIdeaForm } from "@/components/member/create-idea.form";
import { redirect } from "next/navigation";
import { getCategoriesAction } from "./_action";

export default async function CreateIdeaPage() {
  let categories;

  try {
    categories = await getCategoriesAction();
  } catch {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-foreground">Create new idea</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Save as draft anytime. Submit when ready for admin review.
        </p>
      </div>
      <CreateIdeaForm categories={categories} />
    </div>
  );
}
