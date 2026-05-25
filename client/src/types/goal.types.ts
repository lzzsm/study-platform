export interface Goal {
  id: number;
  title: string;
  description: string | null;
  type: "quantitative" | "qualitative";
  completed: boolean;
  target_value: number | null;
  current_value: number;
  workspace_id: number;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}
