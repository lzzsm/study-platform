import api from "./api";
import type { WorkspaceRole } from "@/types/workspaceMember.types";

export const workspaceMemberService = {
  getMembers: async (workspaceId: number) => {
    const { data } = await api.get(`/workspaces/${workspaceId}/members`);
    return data;
  },

  invite: async (workspaceId: number, email: string, role: WorkspaceRole) => {
    const { data } = await api.post(`/workspaces/${workspaceId}/members`, {
      email,
      role,
    });
    return data;
  },

  updateRole: async (
    workspaceId: number,
    userId: number,
    role: WorkspaceRole,
  ) => {
    const { data } = await api.put(
      `/workspaces/${workspaceId}/members/${userId}/role`,
      { role },
    );
    return data;
  },

  remove: async (workspaceId: number, userId: number) => {
    await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },
};
