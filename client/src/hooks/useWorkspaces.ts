import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspace.service";
import type { Workspace } from "@/types/workspace.types";
import type { PaginatedResult } from "@/types/pagination.types";
import { toast } from "sonner";

export function useWorkspaces(page = 1) {
  return useQuery<PaginatedResult<Workspace>>({
    queryKey: ["workspaces", page],
    queryFn: () => workspaceService.getAll(page),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWorkspace(id: number) {
  return useQuery({
    queryKey: ["workspaces", id],
    queryFn: () => workspaceService.getById(id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!id,
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => workspaceService.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace criada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao criar workspace.");
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: number;
      name: string;
      description?: string;
    }) => workspaceService.update(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace atualizada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao atualizar workspace.");
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workspaceService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace excluída.");
    },
    onError: () => {
      toast.error("Erro ao excluir workspace.");
    },
  });
}
