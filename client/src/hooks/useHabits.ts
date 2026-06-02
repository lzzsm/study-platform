import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitService } from "@/services/habit.service";
import { toast } from "sonner";
import type { Habit } from "@/types/habit.types";

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
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });

      const previous = queryClient.getQueryData([
        "workspaces",
        workspaceId,
        "habits",
      ]);

      queryClient.setQueryData(
        ["workspaces", workspaceId, "habits"],
        (old: Habit[] | undefined) => {
          if (!old) return old;
          return old.map((habit: Habit) =>
            habit.id === id ? { ...habit, streak: habit.streak + 1 } : habit,
          );
        },
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["workspaces", workspaceId, "habits"],
          context.previous,
        );
      }
      toast.error("Erro ao completar hábito.");
    },
    onSuccess: (data) => {
      if (data?.alreadyCompleted) {
        toast.info("Hábito já completado hoje.");
      } else {
        toast.success("Hábito completado! 🔥");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces", workspaceId, "habits"],
      });
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

export function useCompleteHabitFromDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitId,
      workspaceId,
    }: {
      habitId: number;
      workspaceId: number;
    }) => habitService.complete(workspaceId, habitId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
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
