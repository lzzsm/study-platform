import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";

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
    onError: (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 422) {
        toast.error("Senha incorreta.");
      } else {
        toast.error("Erro ao excluir conta.");
      }
    },
  });
}

export function useLogoutAll() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.logoutAll(),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      toast.error("Erro ao sair de todos os dispositivos.");
    },
  });
}

export function useDeleteAccount() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentPassword: string) =>
      userService.deleteAccount(currentPassword),
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      queryClient.clear();
      navigate("/login");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error) && error.response?.status === 422) {
        toast.error("Senha incorreta.");
      } else {
        toast.error("Erro ao excluir conta.");
      }
    },
  });
}
