import api from "./api";

export const workspaceService = {
  getAll: async (page = 1, limit = 10) => {
    const { data } = await api.get("/workspaces", { params: { page, limit } });
    return data;
  },

  create: async (name: string, description?: string) => {
    const { data } = await api.post("/workspaces", { name, description });
    return data;
  },

  update: async (id: number, name: string, description?: string) => {
    const { data } = await api.put(`/workspaces/${id}`, { name, description });
    return data;
  },

  remove: async (id: number) => {
    await api.delete(`/workspaces/${id}`);
  },

  getById: async (id: number) => {
    const { data } = await api.get(`/workspaces/${id}`);
    return data;
  },
};
