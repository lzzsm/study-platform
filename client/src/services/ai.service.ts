import api from "./api";
import type { GoalSuggestion } from "@/types/aiSuggestion.types";

export const aiService = {
  suggestGoal: async (
    description: string,
    previousSuggestion?: GoalSuggestion,
    refinementRequest?: string,
  ): Promise<GoalSuggestion> => {
    const { data } = await api.post("/ai/suggest-goal", {
      description,
      previousSuggestion,
      refinementRequest,
    });
    return data;
  },
};
