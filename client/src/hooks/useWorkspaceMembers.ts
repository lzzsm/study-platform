import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceMemberService } from "@/services/workspaceMember.service";
import type { WorkspaceRole } from "@/types/workspaceMember.types";
import { toast } from "sonner";

export function useWorkspaceMembers(workspaceId: number) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "members"],
    queryFn: () => workspaceMemberService.getMembers(workspaceId),
    staleTime: 1000 * 60 * 2,
  });
}

export function useInviteMember(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: WorkspaceRole }) =>
      workspaceMemberService.invite(workspaceId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "members"],
      });
      toast.success("Membro convidado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao convidar membro.");
    },
  });
}

export function useUpdateMemberRole(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: WorkspaceRole }) =>
      workspaceMemberService.updateRole(workspaceId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "members"],
      });
      toast.success("Papel atualizado.");
    },
    onError: () => {
      toast.error("Erro ao atualizar papel.");
    },
  });
}

export function useRemoveMember(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) =>
      workspaceMemberService.remove(workspaceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "members"],
      });
      toast.success("Membro removido.");
    },
    onError: () => {
      toast.error("Erro ao remover membro.");
    },
  });
}
