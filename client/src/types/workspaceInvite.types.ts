import type { WorkspaceRole } from "./workspaceMember.types";

export interface WorkspaceInvite {
  id: number;
  workspace_id: number;
  inviter_id: number;
  invitee_id: number;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "rejected";
  rejected_count: number;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface WorkspaceInviteWithDetails extends WorkspaceInvite {
  workspace_name: string;
  inviter_name: string;
  inviter_avatar_url: string | null;
}
