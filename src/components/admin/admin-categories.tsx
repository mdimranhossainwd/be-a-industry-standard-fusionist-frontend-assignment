"use client";

import {
  createCategoryAction,
  deleteCategoryAction,
} from "@/app/admin/categories/_action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/api.types";
import { Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

// Auto-generate slug from name — e.g. "Solar Energy" → "solar-energy"
function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface AdminCategoriesClientProps {
  initialCategories: Category[];
}

export function AdminCategoriesClient({
  initialCategories,
}: AdminCategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isCreating, startCreating] = useTransition();
  const [isDeleting, startDeleting] = useTransition();

  // When name changes, auto-fill slug unless user manually edited it
  function handleNameChange(value: string) {
    setNewName(value);
    if (!slugManuallyEdited) {
      setNewSlug(toSlug(value));
    }
  }

  // If user edits slug manually, stop auto-generating
  function handleSlugChange(value: string) {
    setSlugManuallyEdited(true);
    setNewSlug(toSlug(value));
  }

  function resetForm() {
    setNewName("");
    setNewSlug("");
    setSlugManuallyEdited(false);
  }

  // ── Create ─────────────────────────────────────────────────────────────────

  function handleCreate() {
    if (!newName.trim()) {
      toast.error("Category name is required");
      return;
    }
    if (!newSlug.trim()) {
      toast.error("Slug is required");
      return;
    }

    startCreating(async () => {
      const result = await createCategoryAction({
        name: newName,
        slug: newSlug,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setCategories((prev) => [...prev, result.data]);
      resetForm();
      toast.success("Category created!");
    });
  }

  // ── Delete ─────────────────────────────────────────────────────────────────

  function handleDelete() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;

    startDeleting(async () => {
      const result = await deleteCategoryAction(id);
      setDeleteTarget(null);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted.");
    });
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Category management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and remove idea categories
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2fr,3fr]">
          {/* ── Create form ──────────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">
                Add category
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="cat-name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cat-name"
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Solar Energy"
                  disabled={isCreating}
                />
              </div>

              {/* Slug — auto-filled from name, editable */}
              <div className="space-y-1.5">
                <Label htmlFor="cat-slug">
                  Slug <span className="text-destructive">*</span>
                </Label>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-muted-foreground select-none">
                    /
                  </span>
                  <Input
                    id="cat-slug"
                    value={newSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="solar-energy"
                    className="font-mono text-sm"
                    disabled={isCreating}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Auto-generated from name. You can edit it.
                </p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                onClick={handleCreate}
                disabled={isCreating || !newName.trim() || !newSlug.trim()}
              >
                {isCreating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add category
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* ── Categories list ───────────────────────────────────────────── */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Categories
                </CardTitle>
                <span className="text-xs text-muted-foreground">
                  {categories.length} total
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="py-12 text-center space-y-1">
                  <p className="text-sm text-muted-foreground">
                    No categories yet
                  </p>
                  <p className="text-xs text-muted-foreground/60">
                    Add your first category using the form
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between rounded-lg border bg-card p-3.5 group"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {category.name}
                        </p>
                        {category.slug && (
                          <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">
                            /{category.slug}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                        onClick={() => setDeleteTarget(category)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !isDeleting && !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                &ldquo;{deleteTarget?.name}&rdquo;
              </span>{" "}
              will be permanently removed. Ideas using this category may be
              affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
