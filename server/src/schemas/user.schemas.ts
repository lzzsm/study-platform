import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(200).optional(),
  avatar_url: z.string().url().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});
