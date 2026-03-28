// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useTransition } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   createIdeaAction,
//   submitIdeaForReviewAction,
//   updateIdeaAction,
// } from "@/app/dashboard/create-idea/_action";
// import { Category, Idea } from "@/types/api.types";

// // ─── Shared zod schema (same one used in _action.ts server-side) ──────────────
// // Client uses it for immediate feedback; server re-validates before DB write.

// import { CreateIdeaInput } from "@/zod/idea.validation";
// import { ImageUploader, UploadedImage } from "./image-uploader";

// // ─── Form values extend CreateIdeaInput but images are UploadedImage[] ────────
// // The uploader needs { url, publicId } objects internally.
// // We strip to url[] only when sending to the server action.

// type FormValues = Omit<CreateIdeaInput, "images"> & {
//   images?: UploadedImage[];
// };

// // ─── Props ────────────────────────────────────────────────────────────────────

// interface CreateIdeaFormProps {
//   categories: Category[];
//   defaultValues?: Idea;
// }

// // ─── Component ────────────────────────────────────────────────────────────────

// export function CreateIdeaForm({
//   categories,
//   defaultValues,
// }: CreateIdeaFormProps) {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();
//   const [submitMode, setSubmitMode] = useState<"draft" | "submit">("draft");
//   const isEditMode = !!defaultValues;

//   // Convert existing string[] → UploadedImage[] for the uploader preview
//  const parsedDefaultImages: UploadedImage[] = (
//   Array.isArray(defaultValues?.images)
//     ? defaultValues.images
//     : defaultValues?.images
//     ? [defaultValues.images]
//     : []
// ).map((url) => ({
//   url,
//   publicId: url.split("/upload/")[1]?.replace(/^v\d+\//, "") ?? url,
// }));

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     control,
//     formState: { errors, isDirty },
//   } = useForm<FormValues>({
//     // Reuse the same schema — no duplicate validation logic
//     // resolver: zodResolver(
//     //   createIdeaZodSchema.omit({ images: true }).extend({
//     //     images: createIdeaZodSchema.shape.images.optional(),
//     //   }) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
//     // ),
//     defaultValues: isEditMode
//       ? {
//           title: defaultValues.title,
//           problemStatement: defaultValues.problemStatement,
//           proposedSolution: defaultValues.proposedSolution,
//           description: defaultValues.description,
//           categoryId: defaultValues.category.id,
//           isPaid: defaultValues.isPaid,
//           price: defaultValues.price ? Number(defaultValues.price) : undefined,
//           images: parsedDefaultImages,
//         }
//       : { isPaid: false, images: [] },
//   });

//   const isPaid = watch("isPaid");

//   // ─── Submit ─────────────────────────────────────────────────────────────────

//   function onSubmit(values: FormValues) {
//     startTransition(async () => {
//       // Strip UploadedImage objects → plain URL strings before sending
//       const payload = {
//         title: values.title,
//         problemStatement: values.problemStatement,
//         proposedSolution: values.proposedSolution,
//         description: values.description,
//         categoryId: values.categoryId,
//         isPaid: values.isPaid,
//         images: values.images?.[0]?.url,
//         ...(values.isPaid && values.price ? { price: values.price } : {}),
//       };

//       // ── Edit ──────────────────────────────────────────────────────────────
//       if (isEditMode && defaultValues) {
//         const result = await updateIdeaAction(defaultValues.id, payload);
//         if (!result.success) {
//           toast.error(result.error);
//           return;
//         }
//         toast.success("Idea updated!");
//         router.push("/dashboard/my-ideas");
//         return;
//       }

//       // ── Create ────────────────────────────────────────────────────────────
//       const result = await createIdeaAction(payload);
//       if (!result.success) {
//         toast.error(result.error);
//         return;
//       }

//       if (submitMode === "draft") {
//         toast.success("Idea saved as draft!");
//         router.push("/dashboard/my-ideas");
//       } else {
//         const submitResult = await submitIdeaForReviewAction(result.data.id);
//         if (!submitResult.success) {
//           toast.warning("Idea created but submit failed. Try from My Ideas.");
//         } else {
//           toast.success("Idea submitted for review!");
//         }
//         router.push("/dashboard/my-ideas");
//       }
//     });
//   }

//   // ─── Render ─────────────────────────────────────────────────────────────────

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} noValidate>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-base font-medium">
//             {isEditMode ? "Edit idea" : "New idea"}
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-5">
//           {/* Title */}
//           <div className="space-y-1.5">
//             <Label htmlFor="title">
//               Title <span className="text-destructive">*</span>
//             </Label>
//             <Input
//               id="title"
//               placeholder="e.g. Solar Roof Co-op for low-income neighbourhoods"
//               {...register("title")}
//             />
//             {errors.title && (
//               <p className="text-xs text-destructive">{errors.title.message}</p>
//             )}
//           </div>

//           {/* Category + Type */}
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-1.5">
//               <Label>
//                 Category <span className="text-destructive">*</span>
//               </Label>
//               <Select
//                 defaultValue={defaultValues?.category.id}
//                 onValueChange={(v) =>
//                   setValue("categoryId", v, { shouldValidate: true })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select category" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {categories.map((cat) => (
//                     <SelectItem key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               {errors.categoryId && (
//                 <p className="text-xs text-destructive">
//                   {errors.categoryId.message}
//                 </p>
//               )}
//             </div>

//             <div className="space-y-1.5">
//               <Label>
//                 Idea type <span className="text-destructive">*</span>
//               </Label>
//               <Select
//                 defaultValue={defaultValues?.isPaid ? "paid" : "free"}
//                 onValueChange={(v) =>
//                   setValue("isPaid", v === "paid", { shouldValidate: true })
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="free">
//                     <span className="flex items-center gap-2">
//                       Free
//                       <Badge
//                         variant="outline"
//                         className="text-xs text-green-700 border-green-300"
//                       >
//                         Anyone can view
//                       </Badge>
//                     </span>
//                   </SelectItem>
//                   <SelectItem value="paid">
//                     <span className="flex items-center gap-2">
//                       Paid
//                       <Badge
//                         variant="outline"
//                         className="text-xs text-purple-700 border-purple-300"
//                       >
//                         Subscribers only
//                       </Badge>
//                     </span>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Price */}
//           {isPaid && (
//             <div className="space-y-1.5">
//               <Label htmlFor="price">
//                 Price (BDT) <span className="text-destructive">*</span>
//               </Label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
//                   ৳
//                 </span>
//                 <Input
//                   id="price"
//                   type="number"
//                   min={1}
//                   className="pl-7"
//                   placeholder="e.g. 50"
//                   {...register("price")}
//                 />
//               </div>
//               {errors.price && (
//                 <p className="text-xs text-destructive">
//                   {errors.price.message}
//                 </p>
//               )}
//             </div>
//           )}

//           {/* Problem statement */}
//           <div className="space-y-1.5">
//             <Label htmlFor="problemStatement">
//               Problem statement <span className="text-destructive">*</span>
//             </Label>
//             <Textarea
//               id="problemStatement"
//               rows={3}
//               placeholder="What problem does this idea address?"
//               {...register("problemStatement")}
//             />
//             {errors.problemStatement && (
//               <p className="text-xs text-destructive">
//                 {errors.problemStatement.message}
//               </p>
//             )}
//           </div>

//           {/* Proposed solution */}
//           <div className="space-y-1.5">
//             <Label htmlFor="proposedSolution">
//               Proposed solution <span className="text-destructive">*</span>
//             </Label>
//             <Textarea
//               id="proposedSolution"
//               rows={3}
//               placeholder="How will this idea solve the problem?"
//               {...register("proposedSolution")}
//             />
//             {errors.proposedSolution && (
//               <p className="text-xs text-destructive">
//                 {errors.proposedSolution.message}
//               </p>
//             )}
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//             <Label htmlFor="description">
//               Detailed description <span className="text-destructive">*</span>
//             </Label>
//             <Textarea
//               id="description"
//               rows={5}
//               placeholder="Implementation steps, expected impact, resources needed..."
//               {...register("description")}
//             />
//             {errors.description && (
//               <p className="text-xs text-destructive">
//                 {errors.description.message}
//               </p>
//             )}
//           </div>

//           {/* Images */}
//           <div className="space-y-1.5">
//             <Label>
//               Images{" "}
//               <span className="text-muted-foreground font-normal text-xs">
//                 — optional, you can add later
//               </span>
//             </Label>
//             <Controller
//               name="images"
//               control={control}
//               render={({ field }) => (
//                 <ImageUploader
//                   value={field.value ?? []}
//                   onChange={field.onChange}
//                   maxImages={5}
//                   disabled={isPending}
//                 />
//               )}
//             />
//           </div>
//         </CardContent>

//         <CardFooter className="flex items-center justify-between gap-3 pt-2">
//           <Button
//             type="button"
//             variant="ghost"
//             className="text-sm"
//             onClick={() => router.back()}
//             disabled={isPending}
//           >
//             Cancel
//           </Button>

//           <div className="flex gap-2">
//             {!isEditMode && (
//               <Button
//                 type="submit"
//                 variant="outline"
//                 disabled={isPending}
//                 onClick={() => setSubmitMode("draft")}
//               >
//                 {isPending && submitMode === "draft"
//                   ? "Saving..."
//                   : "Save as draft"}
//               </Button>
//             )}
//             <Button
//               type="submit"
//               disabled={isPending || (isEditMode && !isDirty)}
//               onClick={() => setSubmitMode("submit")}
//             >
//               {isPending && submitMode === "submit"
//                 ? isEditMode
//                   ? "Updating..."
//                   : "Submitting..."
//                 : isEditMode
//                   ? "Update idea"
//                   : "Submit for review"}
//             </Button>
//           </div>
//         </CardFooter>
//       </Card>
//     </form>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  createIdeaAction,
  submitIdeaForReviewAction,
  updateIdeaAction,
} from "@/app/dashboard/create-idea/_action";
import { Category, Idea } from "@/types/api.types";
import { CreateIdeaInput } from "@/zod/idea.validation";
import { BookmarkIcon, SendHorizontal, X } from "lucide-react";
import { ImageUploader, UploadedImage } from "./image-uploader";

type FormValues = Omit<CreateIdeaInput, "images"> & {
  images?: UploadedImage[];
};

interface CreateIdeaFormProps {
  categories: Category[];
  defaultValues?: Idea;
}

export function CreateIdeaForm({
  categories,
  defaultValues,
}: CreateIdeaFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [submitMode, setSubmitMode] = useState<"draft" | "submit">("draft");
  const isEditMode = !!defaultValues;

  // const parsedDefaultImages: UploadedImage[] = (
  //   Array.isArray(defaultValues?.images)
  //     ? defaultValues.images
  //     : defaultValues?.images
  //       ? [defaultValues.images]
  //       : []
  // ).map((url) => ({
  //   url,
  //   publicId: url.split("/upload/")[1]?.replace(/^v\d+\//, "") ?? url,
  // }));

  const parsedDefaultImages: UploadedImage[] = defaultValues?.images
    ? [
        {
          url: defaultValues.images,
          publicId:
            defaultValues.images.split("/upload/")[1]?.replace(/^v\d+\//, "") ??
            defaultValues.images,
        },
      ]
    : [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: isEditMode
      ? {
          title: defaultValues.title,
          problemStatement: defaultValues.problemStatement,
          proposedSolution: defaultValues.proposedSolution,
          description: defaultValues.description,
          categoryId: defaultValues.category.id,
          isPaid: defaultValues.isPaid,
          price: defaultValues.price ? Number(defaultValues.price) : undefined,
          images: parsedDefaultImages,
        }
      : { isPaid: false, images: [] },
  });

  const isPaid = watch("isPaid");

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const payload = {
        title: values.title,
        problemStatement: values.problemStatement,
        proposedSolution: values.proposedSolution,
        description: values.description,
        categoryId: values.categoryId,
        isPaid: values.isPaid,
        images: values.images?.[0]?.url || "",
        ...(values.isPaid && values.price ? { price: values.price } : {}),
      };

      if (isEditMode && defaultValues) {
        const result = await updateIdeaAction(defaultValues.id, payload);
        if (!result.success) {
          toast.error(result.error);
          return;
        }
        toast.success("Idea updated!");
        router.push("/dashboard/my-ideas");
        return;
      }

      const result = await createIdeaAction(payload);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (submitMode === "draft") {
        toast.success("Idea saved as draft!");
        router.push("/dashboard/my-ideas");
      } else {
        const submitResult = await submitIdeaForReviewAction(result.data.id);
        if (!submitResult.success) {
          toast.warning("Idea created but submit failed. Try from My Ideas.");
        } else {
          toast.success("Idea submitted for review!");
        }
        router.push("/dashboard/my-ideas");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-[15px] font-semibold tracking-tight">
            {isEditMode ? "Edit idea" : "New idea"}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-[13px] font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              className="h-9 text-[13px]"
              placeholder="e.g. Solar Roof Co-op for low-income neighbourhoods"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-[11px] text-destructive leading-snug">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue={defaultValues?.category.id}
                onValueChange={(v) =>
                  setValue("categoryId", v, { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-[13px]"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-[11px] text-destructive leading-snug">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[13px] font-medium">
                Idea type <span className="text-destructive">*</span>
              </Label>
              <Select
                defaultValue={defaultValues?.isPaid ? "paid" : "free"}
                onValueChange={(v) =>
                  setValue("isPaid", v === "paid", { shouldValidate: true })
                }
              >
                <SelectTrigger className="h-9 text-[13px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free" className="text-[13px]">
                    <span className="flex items-center gap-2">
                      Free
                      <Badge
                        variant="outline"
                        className="text-[11px] text-green-700 border-green-300"
                      >
                        Anyone can view
                      </Badge>
                    </span>
                  </SelectItem>
                  <SelectItem value="paid" className="text-[13px]">
                    <span className="flex items-center gap-2">
                      Paid
                      <Badge
                        variant="outline"
                        className="text-[11px] text-purple-700 border-purple-300"
                      >
                        Subscribers only
                      </Badge>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price */}
          {isPaid && (
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-[13px] font-medium">
                Price (BDT) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
                  ৳
                </span>
                <Input
                  id="price"
                  type="number"
                  min={1}
                  className="pl-7 h-9 text-[13px]"
                  placeholder="e.g. 50"
                  {...register("price")}
                />
              </div>
              {errors.price && (
                <p className="text-[11px] text-destructive leading-snug">
                  {errors.price.message}
                </p>
              )}
            </div>
          )}

          {/* Problem statement */}
          <div className="space-y-1.5">
            <Label
              htmlFor="problemStatement"
              className="text-[13px] font-medium"
            >
              Problem statement <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="problemStatement"
              rows={3}
              className="text-[13px] resize-none"
              placeholder="What problem does this idea address?"
              {...register("problemStatement")}
            />
            {errors.problemStatement && (
              <p className="text-[11px] text-destructive leading-snug">
                {errors.problemStatement.message}
              </p>
            )}
          </div>

          {/* Proposed solution */}
          <div className="space-y-1.5">
            <Label
              htmlFor="proposedSolution"
              className="text-[13px] font-medium"
            >
              Proposed solution <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="proposedSolution"
              rows={3}
              className="text-[13px] resize-none"
              placeholder="How will this idea solve the problem?"
              {...register("proposedSolution")}
            />
            {errors.proposedSolution && (
              <p className="text-[11px] text-destructive leading-snug">
                {errors.proposedSolution.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-[13px] font-medium">
              Detailed description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={5}
              className="text-[13px] resize-none"
              placeholder="Implementation steps, expected impact, resources needed..."
              {...register("description")}
            />
            {errors.description && (
              <p className="text-[11px] text-destructive leading-snug">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Images */}
          <div className="space-y-1.5">
            <Label className="text-[13px] font-medium">
              Images{" "}
              <span className="text-muted-foreground font-normal text-[12px]">
                — optional, you can add later
              </span>
            </Label>
            <Controller
              name="images"
              control={control}
              render={({ field }) => (
                <ImageUploader
                  value={field.value ?? []}
                  onChange={field.onChange}
                  maxImages={5}
                  disabled={isPending}
                />
              )}
            />
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between gap-3 pt-3 border-t">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-[13px] gap-1.5 h-8"
            onClick={() => router.back()}
            disabled={isPending}
          >
            <X className="w-3.5 h-3.5" />
            Cancel
          </Button>

          <div className="flex gap-2">
            {!isEditMode && (
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="text-[13px] gap-1.5 h-8"
                disabled={isPending}
                onClick={() => setSubmitMode("draft")}
              >
                <BookmarkIcon className="w-3.5 h-3.5" />
                {isPending && submitMode === "draft"
                  ? "Saving…"
                  : "Save as draft"}
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="text-[13px] gap-1.5 h-8"
              disabled={isPending || (isEditMode && !isDirty)}
              onClick={() => setSubmitMode("submit")}
            >
              <SendHorizontal className="w-3.5 h-3.5" />
              {isPending && submitMode === "submit"
                ? isEditMode
                  ? "Updating…"
                  : "Submitting…"
                : isEditMode
                  ? "Update idea"
                  : "Submit for review"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
