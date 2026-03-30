import { CreateIdeaForm } from "@/components/member/create-idea.form";
import { notFound, redirect } from "next/navigation";
import { getCategoriesAction, getIdeaByIdAction } from "./_action";

interface CreateIdeaPageProps {
  searchParams: Promise<{ edit?: string }>;
}

export default async function CreateIdeaPage({
  searchParams,
}: CreateIdeaPageProps) {
  const { edit: editId } = await searchParams;
  const isEditMode = !!editId;

  let categories;
  let existingIdea = null;

  try {
    // Always fetch categories
    categories = await getCategoriesAction();
  } catch {
    redirect("/login");
  }

  // Edit mode — fetch the idea to prefill the form
  if (isEditMode) {
    existingIdea = await getIdeaByIdAction(editId);

    // Idea not found or doesn't belong to user → 404
    if (!existingIdea) {
      notFound();
    }

    // Only DRAFT and REJECTED ideas can be edited
    if (existingIdea.status !== "DRAFT" && existingIdea.status !== "REJECTED") {
      redirect("/dashboard/my-ideas");
    }
  }

  return (
    <div className="w-full mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {isEditMode ? "Edit idea" : "Create new idea"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEditMode
            ? "Update your idea and resubmit for review."
            : "Save as draft anytime. Submit when ready for admin review."}
        </p>
      </div>

      <CreateIdeaForm
        categories={categories}
        defaultValues={existingIdea ?? undefined}
      />
    </div>
  );
}
