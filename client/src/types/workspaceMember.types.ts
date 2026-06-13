export type WorkspaceRole = "owner" | "editor" | "viewer";

export interface WorkspaceMember {
  id: number;
  workspace_id: number;
  user_id: number;
  role: WorkspaceRole;
  invited_by: number | null;
  created_at: string;
  name: string;
  email: string;
  avatar_url: string | null;
}
