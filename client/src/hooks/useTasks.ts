import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import type { Task } from "@/types/task.types";

export function useTasks(
  workspaceId: number,
  page = 1,
  status?: "pending" | "completed",
) {
  return useQuery({
    queryKey: ["workspaces", workspaceId, "tasks", page, status],
    queryFn: () => taskService.getAll(workspaceId, page, 10, status),
    staleTime: 1000 * 30, // 30 seconds
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
    onMutate: async ({ id, completed }) => {
      await queryClient.cancelQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });

      const previous = queryClient.getQueryData([
        "workspaces",
        workspaceId,
        "tasks",
      ]);

      queryClient.setQueryData(
        ["workspaces", workspaceId, "tasks"],
        (old: { tasks: Task[]; total: number } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            tasks: old.tasks.map((task: Task) =>
              task.id === id ? { ...task, completed } : task,
            ),
          };
        },
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["workspaces", workspaceId, "tasks"],
          context.previous,
        );
      }
      toast.error("Erro ao atualizar tarefa.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "tasks"],
      });
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
