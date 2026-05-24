export interface Workspace {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}