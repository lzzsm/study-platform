import api from "./api";

export const taskService = {
  getAll: async (workspaceId: number) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/tasks`);
    return data;
  },

  create: async (workspaceId: number, title: string, description?: string) => {
    const { data } = await api.post(`/workspaces/${workspaceId}/tasks`, {
      title,
      description,
    });
    return data;
  },

  update: async (
    workspaceId: number,
    id: number,
    title: string,
    description?: string,
  ) => {
    const { data } = await api.put(`/workspaces/${workspaceId}/tasks/${id}`, {
      title,
      description,
    });
    return data;
  },

  toggle: async (workspaceId: number, id: number, completed: boolean) => {
    const { data } = await api.patch(
      `/workspaces/${workspaceId}/tasks/${id}/toggle`,
      { completed },
    );
    return data;
  },

  remove: async (workspaceId: number, id: number) => {
    await api.delete(`/workspaces/${workspaceId}/tasks/${id}`);
  },
};
