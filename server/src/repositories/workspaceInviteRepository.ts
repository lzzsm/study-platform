import pool from "../database";
import { WorkspaceRole } from "../types/workspaceMember.types";
import type {
  WorkspaceInvite,
  WorkspaceInviteWithDetails,
} from "../types/workspaceInvite.types";

async function create(
  workspace_id: number,
  inviter_id: number,
  invitee_id: number,
  role: WorkspaceRole,
): Promise<WorkspaceInvite> {
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 15);

  const result = await pool.query(
    `INSERT INTO workspace_invites
     (workspace_id, inviter_id, invitee_id, role, expires_at)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [workspace_id, inviter_id, invitee_id, role, expires_at],
  );
  return result.rows[0];
}

async function findByWorkspaceAndInvitee(
  workspace_id: number,
  invitee_id: number,
): Promise<WorkspaceInvite | null> {
  const result = await pool.query(
    `SELECT * FROM workspace_invites
     WHERE workspace_id = $1 AND invitee_id = $2`,
    [workspace_id, invitee_id],
  );
  return result.rows[0] || null;
}

async function findPendingByInvitee(
  invitee_id: number,
): Promise<WorkspaceInviteWithDetails[]> {
  const result = await pool.query(
    `SELECT wi.*,
            w.name AS workspace_name,
            u.name AS inviter_name,
            u.avatar_url AS inviter_avatar_url
     FROM workspace_invites wi
     JOIN workspaces w ON w.id = wi.workspace_id
     JOIN users u ON u.id = wi.inviter_id
     WHERE wi.invitee_id = $1
       AND wi.status = 'pending'
       AND wi.expires_at > NOW()
     ORDER BY wi.created_at DESC`,
    [invitee_id],
  );
  return result.rows;
}

async function findPendingByWorkspace(
  workspace_id: number,
): Promise<WorkspaceInviteWithDetails[]> {
  const result = await pool.query(
    `SELECT wi.*,
            w.name AS workspace_name,
            u.name AS inviter_name,
            u.avatar_url AS inviter_avatar_url
     FROM workspace_invites wi
     JOIN workspaces w ON w.id = wi.workspace_id
     JOIN users u ON u.id = wi.inviter_id
     WHERE wi.workspace_id = $1
       AND wi.status = 'pending'
       AND wi.expires_at > NOW()
     ORDER BY wi.created_at DESC`,
    [workspace_id],
  );
  return result.rows;
}

async function findById(id: number): Promise<WorkspaceInvite | null> {
  const result = await pool.query(
    `SELECT * FROM workspace_invites WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
}

async function updateStatus(
  id: number,
  status: "pending" | "accepted" | "rejected",
  incrementRejected = false,
): Promise<WorkspaceInvite | null> {
  const result = await pool.query(
    `UPDATE workspace_invites
     SET status = $1,
         rejected_count = rejected_count + $2,
         updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [status, incrementRejected ? 1 : 0, id],
  );
  return result.rows[0] || null;
}

async function reactivate(
  id: number,
  role: WorkspaceRole,
): Promise<WorkspaceInvite | null> {
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 15);

  const result = await pool.query(
    `UPDATE workspace_invites
     SET status = 'pending',
         role = $1,
         expires_at = $2,
         updated_at = NOW()
     WHERE id = $3 RETURNING *`,
    [role, expires_at, id],
  );
  return result.rows[0] || null;
}

async function cancel(id: number): Promise<void> {
  await pool.query(`DELETE FROM workspace_invites WHERE id = $1`, [id]);
}

export const workspaceInviteRepository = {
  create,
  findByWorkspaceAndInvitee,
  findPendingByInvitee,
  findById,
  updateStatus,
  reactivate,
  cancel,
  findPendingByWorkspace,
};
