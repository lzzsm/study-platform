import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService } from "@/services/habit.service";
import { toast } from "sonner";

export function useHabits(workspaceId: number) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "habits"],
    queryFn: () => habitService.getAll(workspaceId),
  });
}

export function useCreateHabit(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => habitService.create(workspaceId, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });
      toast.success("Hábito criado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar hábito.");
    },
  });
}

export function useCompleteHabit(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => habitService.complete(workspaceId, id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });
      if (data?.alreadyCompleted) {
        toast.info("Hábito já completado hoje.");
      } else {
        toast.success("Hábito completado! 🔥");
      }
    },
    onError: () => {
      toast.error("Erro ao completar hábito.");
    },
  });
}

export function useDeleteHabit(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => habitService.remove(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });
      toast.success("Hábito excluído.");
    },
    onError: () => {
      toast.error("Erro ao excluir hábito.");
    },
  });
}

export function useUpdateHabit(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
    }: {
      id: number;
      title: string;
      description?: string;
    }) => habitService.update(workspaceId, id, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });
      toast.success("Hábito atualizado com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar hábito.");
    },
  });
}
