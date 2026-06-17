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
};
