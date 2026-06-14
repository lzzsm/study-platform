import pool from "../database";
import { PoolClient } from "pg";
import {
  WorkspaceMember,
  WorkspaceMemberWithUser,
  WorkspaceRole,
} from "../types/workspaceMember.types";

async function addMember(
  workspace_id: number,
  user_id: number,
  role: WorkspaceRole,
  invited_by: number,
  client?: PoolClient,
): Promise<WorkspaceMember> {
  const db = client ?? pool;
  const result = await db.query(
    `INSERT INTO workspace_members (workspace_id, user_id, role, invited_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [workspace_id, user_id, role, invited_by],
  );
  return result.rows[0];
}

async function removeMember(
  workspace_id: number,
  user_id: number,
): Promise<void> {
  await pool.query(
    `DELETE FROM workspace_members WHERE workspace_id = $1 AND user_id = $2`,
    [workspace_id, user_id],
  );
}

async function updateRole(
  workspace_id: number,
  user_id: number,
  role: WorkspaceRole,
): Promise<WorkspaceMember | null> {
  const result = await pool.query(
    `UPDATE workspace_members SET role = $1
     WHERE workspace_id = $2 AND user_id = $3 RETURNING *`,
    [role, workspace_id, user_id],
  );
  return result.rows[0] || null;
}

async function findMembers(
  workspace_id: number,
): Promise<WorkspaceMemberWithUser[]> {
  const result = await pool.query(
    `SELECT wm.*, u.name, u.email, u.avatar_url
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
     ORDER BY wm.created_at ASC`,
    [workspace_id],
  );
  return result.rows;
}

async function findMembership(
  workspace_id: number,
  user_id: number,
): Promise<WorkspaceMember | null> {
  const result = await pool.query(
    `SELECT * FROM workspace_members
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspace_id, user_id],
  );
  return result.rows[0] || null;
}

export const workspaceMemberRepository = {
  addMember,
  removeMember,
  updateRole,
  findMembers,
  findMembership,
};
