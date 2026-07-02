export interface SuggestedGoal {
  title: string;
  description: string;
  type: "quantitative" | "qualitative";
  target_value: number | null;
}

export interface SuggestedItem {
  title: string;
  description: string;
}

export interface GoalSuggestion {
  goal: SuggestedGoal;
  tasks: SuggestedItem[];
  habits: SuggestedItem[];
}
