import { z } from "zod";

export const createGoalSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().optional(),
    type: z.enum(["quantitative", "qualitative"]),
    target_value: z.number().positive().optional(),
    expires_at: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "quantitative" && !data.target_value) return false;
      return true;
    },
    { message: "Metas quantitativas precisam de um valor alvo." },
  );

export const updateGoalSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(["quantitative", "qualitative"]).optional(),
  target_value: z.number().positive().optional(),
  expires_at: z.string().optional(),
});

export const updateProgressSchema = z.object({
  current_value: z.number().min(0),
});

export const toggleGoalSchema = z.object({
  completed: z.boolean(),
});
