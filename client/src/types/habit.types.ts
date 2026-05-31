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
