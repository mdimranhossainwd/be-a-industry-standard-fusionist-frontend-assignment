"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { authService } from "@/lib/services";
import { categoryService } from "@/lib/services/category.service";
import { tutorService } from "@/lib/services/tutor.service";
import type { Category } from "@/types/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const tutorProfileSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  hourlyRate: z.number().min(1, "Hourly rate must be at least $1"),
  subjects: z.string().min(1, "Please add at least one subject"),
  categoryIds: z
    .array(z.string())
    .min(1, "Please select at least one category"),
});

type TutorProfileFormData = z.infer<typeof tutorProfileSchema>;

export default function TutorProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TutorProfileFormData>({
    resolver: zodResolver(tutorProfileSchema),
    defaultValues: {
      bio: "",
      hourlyRate: 0,
      subjects: "",
      categoryIds: [],
    },
  });

  const selectedCategoryIds = watch("categoryIds") || [];

  useEffect(() => {
  const loadData = async () => {
    try {
      const [cats, user] = await Promise.all([
        categoryService.getAllCategories(),
        authService.getProfile(),
      ]);
      
      console.log("👤 User data:", user); // ✅ Check করুন কি আসছে
      
      setCategories(cats);

      // ✅ Safe check
      if (user?.tutorProfile) {
        reset({
          bio: user.tutorProfile.bio || "",
          hourlyRate: user.tutorProfile.hourlyRate || 0,
          subjects: Array.isArray(user.tutorProfile.subjects) 
            ? user.tutorProfile.subjects.join(", ") 
            : "",
          categoryIds: Array.isArray(user.tutorProfile.categories)
            ? user.tutorProfile.categories.map((c) => c.id)
            : [],
        });
      } else {
        console.log("⚠️ No tutor profile found");
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsInitialLoading(false);
    }
  };
  loadData();
}, [reset]);

  const onSubmit = async (data: TutorProfileFormData) => {
    setIsLoading(true);
    try {
      const subjects = data.subjects.split(",").map((s) => s.trim());

      await tutorService.createOrUpdateProfile({
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        subjects,
        categoryIds: data.categoryIds,
      });

      toast.success("Profile updated successfully!");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    const current = selectedCategoryIds;
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];
    setValue("categoryIds", updated, { shouldValidate: true });
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tutor Profile</h1>
        <p className="text-gray-600">
          Manage your tutor profile and specializations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your teaching profile to attract more students
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell students about your experience and teaching style..."
                rows={5}
                {...register("bio")}
                disabled={isLoading}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                placeholder="50"
                {...register("hourlyRate", { valueAsNumber: true })}
                disabled={isLoading}
              />
              {errors.hourlyRate && (
                <p className="text-sm text-red-500">
                  {errors.hourlyRate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (comma-separated)</Label>
              <Input
                id="subjects"
                type="text"
                placeholder="Mathematics, Physics, Chemistry"
                {...register("subjects")}
                disabled={isLoading}
              />
              <p className="text-sm text-gray-500">
                Add subjects you can teach, separated by commas
              </p>
              {errors.subjects && (
                <p className="text-sm text-red-500">
                  {errors.subjects.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategoryIds.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
              {categories.length === 0 && (
                <p className="text-sm text-yellow-600">
                  No categories found. Contact admin to add categories.
                </p>
              )}
              {errors.categoryIds && (
                <p className="text-sm text-red-500">
                  {errors.categoryIds.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-violet-600 w-full mt-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
