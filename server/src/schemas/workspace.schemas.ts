import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2),
  description: z.string().max(200).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().max(200).optional(),
});