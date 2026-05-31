import { z } from "zod";

export const createHabitSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateHabitSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});
