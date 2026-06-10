import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: userService.getMe,
    staleTime: 1000 * 60 * 10,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      bio?: string;
      avatar_url?: string;
    }) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar perfil.");
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (payload: { currentPassword: string; newPassword: string }) =>
      userService.updatePassword(payload),
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
    },
    onError: () => {
      toast.error("Senha atual incorreta.");
    },
  });
}
