import api from "./api";

export const analyticsService = {
  getAnalytics: async () => {
    const { data } = await api.get("/analytics");
    return data;
  },
};
