import { z } from "zod";

export const createIdeaZodSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title is too long"),
    problemStatement: z
      .string()
      .min(20, "Problem statement must be at least 20 characters"),
    proposedSolution: z
      .string()
      .min(20, "Proposed solution must be at least 20 characters"),
    description: z
      .string()
      .min(30, "Description must be at least 30 characters"),
    categoryId: z.string().min(1, "Please select a category"),
    isPaid: z.boolean("Idea type is required").default(false),
    price: z.coerce.number().min(1, "Price must be at least 1").optional(),
    images: z.string().url("Each image must be a valid URL").optional(),
  })
  .refine((data) => !(data.isPaid && !data.price), {
    message: "Price is required for paid ideas",
    path: ["price"],
  });

export const updateIdeaZodSchema = createIdeaZodSchema
  .refine((data) => !(data.isPaid && !data.price), {
    message: "Price is required for paid ideas",
    path: ["price"],
  })
  .optional();

export type CreateIdeaInput = z.infer<typeof createIdeaZodSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaZodSchema>;
