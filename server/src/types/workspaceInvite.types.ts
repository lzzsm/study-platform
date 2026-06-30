import { WorkspaceRole } from "./workspaceMember.types";

export interface WorkspaceInvite {
  id: number;
  workspace_id: number;
  inviter_id: number;
  invitee_id: number;
  role: WorkspaceRole;
  status: "pending" | "accepted" | "rejected";
  rejected_count: number;
  expires_at: Date;
  created_at: Date;
  updated_at: Date;
}

export interface WorkspaceInviteWithDetails extends WorkspaceInvite {
  workspace_name: string;
  inviter_name: string;
  inviter_avatar_url: string | null;
}
