import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  bio: z.string().max(200).optional(),
  avatar_url: z.string().url("URL inválida").optional().or(z.literal("")),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Campo obrigatório"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Campo obrigatório"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
  });

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
