import api from "./api";

export const habitService = {
  getAll: async (workspaceId: number, page = 1, limit = 10) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/habits`, {
      params: { page, limit },
    });
    return data;
  },

  create: async (workspaceId: number, title: string, description?: string) => {
    const { data } = await api.post(`/workspaces/${workspaceId}/habits`, {
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
    const { data } = await api.put(`/workspaces/${workspaceId}/habits/${id}`, {
      title,
      description,
    });
    return data;
  },

  complete: async (workspaceId: number, id: number) => {
    const { data } = await api.patch(
      `/workspaces/${workspaceId}/habits/${id}/complete`,
      {},
    );
    return data;
  },

  remove: async (workspaceId: number, id: number) => {
    await api.delete(`/workspaces/${workspaceId}/habits/${id}`);
  },
};
