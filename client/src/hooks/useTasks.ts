import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";

export function useTasks(workspaceId: number) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "tasks"],
    queryFn: () => taskService.getAll(workspaceId),
  });
}

export function useCreateTask(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      description,
    }: {
      title: string;
      description?: string;
    }) => taskService.create(workspaceId, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
      toast.success("Task criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar task.");
    },
  });
}

export function useUpdateTask(workspaceId: number) {
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
    }) => taskService.update(workspaceId, id, title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
      toast.success("Task atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar task.");
    },
  });
}

export function useToggleTask(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      taskService.toggle(workspaceId, id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
    },
    onError: () => {
      toast.error("Erro ao atualizar task.");
    },
  });
}

export function useDeleteTask(workspaceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => taskService.remove(workspaceId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
      toast.success("Task excluída.");
    },
    onError: () => {
      toast.error("Erro ao excluir task.");
    },
  });
}
