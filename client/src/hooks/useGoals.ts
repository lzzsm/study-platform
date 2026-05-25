import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { goalService } from "@/services/goal.service";
import { toast } from "sonner";

export function useGoals(workspaceId: number) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "goals"],
    queryFn: () => goalService.getAll(workspaceId),
  });
}

export function useCreateGoal(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      description?: string;
      type: "quantitative" | "qualitative";
      target_value?: number;
      expires_at?: string;
    }) => goalService.create(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "goals"],
      });
      toast.success("Meta criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar meta.");
    },
  });
}

export function useUpdateGoal(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      title?: string;
      description?: string;
      target_value?: number;
      expires_at?: string;
    }) => goalService.update(workspaceId, id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "goals"],
      });
      toast.success("Meta atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar meta.");
    },
  });
}

export function useUpdateGoalProgress(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      current_value,
    }: {
      id: number;
      current_value: number;
    }) => goalService.updateProgress(workspaceId, id, current_value),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "goals"],
      });
    },
    onError: () => {
      toast.error("Erro ao atualizar progresso.");
    },
  });
}

export function useToggleGoal(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      goalService.toggle(workspaceId, id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "goals"],
      });
    },
    onError: () => {
      toast.error("Erro ao atualizar meta.");
    },
  });
}

export function useDeleteGoal(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => goalService.remove(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "goals"],
      });
      toast.success("Meta excluída.");
    },
    onError: () => {
      toast.error("Erro ao excluir meta.");
    },
  });
}
