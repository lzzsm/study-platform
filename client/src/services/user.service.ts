import api from "./api";

export const userService = {
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },
}