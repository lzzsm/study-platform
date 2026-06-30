import api from "./api";

export const workspaceInviteService = {
  getPending: async () => {
    const { data } = await api.get("/invites");
    return data;
  },

  getPendingByWorkspace: async (workspaceId: number) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/invite`);
    return data;
  },

  invite: async (workspaceId: number, email: string, role: string) => {
    const { data } = await api.post(`/workspaces/${workspaceId}/invite`, {
      email,
      role,
    });
    return data;
  },

  accept: async (inviteId: number) => {
    await api.post(`/invites/${inviteId}/accept`);
  },

  reject: async (inviteId: number) => {
    await api.post(`/invites/${inviteId}/reject`);
  },

  cancel: async (inviteId: number) => {
    await api.delete(`/invites/${inviteId}`);
  },
};
