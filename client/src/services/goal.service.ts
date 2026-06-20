import api from "./api";

export const goalService = {
  getAll: async (workspaceId: number, page = 1, limit = 10) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/goals`, {
      params: { page, limit },
    });
    return data;
  },

  create: async (
    workspaceId: number,
    payload: {
      title: string;
      description?: string;
      type: "quantitative" | "qualitative";
      target_value?: number;
      expires_at?: string;
    },
  ) => {
    const { data } = await api.post(
      `/workspaces/${workspaceId}/goals`,
      payload,
    );
    return data;
  },

  update: async (
    workspaceId: number,
    id: number,
    payload: {
      title?: string;
      description?: string;
      target_value?: number;
      expires_at?: string;
    },
  ) => {
    const { data } = await api.put(
      `/workspaces/${workspaceId}/goals/${id}`,
      payload,
    );
    return data;
  },

  updateProgress: async (
    workspaceId: number,
    id: number,
    current_value: number,
  ) => {
    const { data } = await api.patch(
      `/workspaces/${workspaceId}/goals/${id}/progress`,
      { current_value },
    );
    return data;
  },

  toggle: async (workspaceId: number, id: number, completed: boolean) => {
    const { data } = await api.patch(
      `/workspaces/${workspaceId}/goals/${id}/toggle`,
      { completed },
    );
    return data;
  },

  remove: async (workspaceId: number, id: number) => {
    await api.delete(`/workspaces/${workspaceId}/goals/${id}`);
  },
};
