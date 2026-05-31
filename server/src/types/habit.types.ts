export interface Habit {
  id: number;
  title: string;
  description: string | null;
  streak: number;
  workspace_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  completed_at: string;
  created_at: string;
}
