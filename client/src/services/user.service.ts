import type { PublicProfile, UserSearchResult } from "@/types/user.types";
import api from "./api";

export const userService = {
  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateProfile: async (payload: {
    name: string;
    bio?: string;
    avatar_url?: string;
  }) => {
    const { data } = await api.put("/users/me", payload);
    return data;
  },

  updatePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    await api.put("/users/me/password", payload);
  },

  logoutAll: async () => {
    await api.post("/users/me/logout-all");
  },

  deleteAccount: async (currentPassword: string) => {
    await api.delete("/users/me", { data: { currentPassword } });
  },

  search: async (query: string): Promise<UserSearchResult[]> => {
    const { data } = await api.get("/users/search", { params: { q: query } });
    return data;
  },

  getPublicProfile: async (id: number): Promise<PublicProfile> => {
    const { data } = await api.get(`/users/${id}/profile`);
    return data;
  },
};
