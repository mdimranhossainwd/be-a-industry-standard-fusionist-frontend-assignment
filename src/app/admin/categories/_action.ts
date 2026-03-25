"use server";

import { httpClient } from "@/lib/axios/httpClient";
import { Category } from "@/types/api.types";
import { revalidatePath } from "next/cache";

function unwrap<T>(res: { data: T }): T {
  return res.data;
}

export async function getCategoriesAction(): Promise<Category[]> {
  const res = await httpClient.get<Category[]>("/categories");
  return unwrap(res);
}

export async function createCategoryAction(payload: {
  name: string;
  slug: string;
}): Promise<
  { success: true; data: Category } | { success: false; error: string }
> {
  if (!payload.name.trim()) {
    return { success: false, error: "Category name is required" };
  }
  if (!payload.slug.trim()) {
    return { success: false, error: "Slug is required" };
  }

  try {
    const res = await httpClient.post<Category>("/categories", {
      name: payload.name.trim(),
      slug: payload.slug.trim(),
    });
    revalidatePath("/admin/categories");
    return { success: true, data: unwrap(res) };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  if (!id) return { success: false, error: "Invalid category ID" };

  try {
    await httpClient.delete(`/categories/category/${id}`);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: message };
  }
}
