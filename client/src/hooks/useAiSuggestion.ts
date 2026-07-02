import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/services/ai.service";
import type { GoalSuggestion } from "@/types/aiSuggestion.types";
import { toast } from "sonner";

export function useSuggestGoal() {
  return useMutation({
    mutationFn: ({
      description,
      previousSuggestion,
      refinementRequest,
    }: {
      description: string;
      previousSuggestion?: GoalSuggestion;
      refinementRequest?: string;
    }) =>
      aiService.suggestGoal(description, previousSuggestion, refinementRequest),
    onError: () => {
      toast.error("Erro ao gerar sugestão. Tente novamente.");
    },
  });
}
