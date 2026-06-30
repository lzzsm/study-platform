import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceInviteService } from "@/services/workspaceInvite.service";
import { toast } from "sonner";

export function usePendingInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: workspaceInviteService.getPending,
    staleTime: 1000 * 60,
  });
}

export function useWorkspacePendingInvites(workspaceId: number) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "invites"],
    queryFn: () => workspaceInviteService.getPendingByWorkspace(workspaceId),
    staleTime: 1000 * 60,
  });
}

export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => workspaceInviteService.accept(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Convite aceito!");
    },
    onError: () => {
      toast.error("Erro ao aceitar convite.");
    },
  });
}

export function useRejectInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => workspaceInviteService.reject(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      toast.success("Convite recusado.");
    },
    onError: () => {
      toast.error("Erro ao recusar convite.");
    },
  });
}

export function useCancelInvite(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: number) => workspaceInviteService.cancel(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites"] });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "invites"],
      });
      toast.success("Convite cancelado.");
    },
    onError: () => {
      toast.error("Erro ao cancelar convite.");
    },
  });
}

export function useInviteMember(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) =>
      workspaceInviteService.invite(workspaceId, email, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "invites"],
      });
      toast.success("Convite enviado!");
    },
    onError: () => {
      toast.error("Erro ao enviar convite.");
    },
  });
}
