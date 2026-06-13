import pool from "../database";
import { Workspace } from "../types/workspace.types";

async function findById(
  id: number,
  user_id: number,
): Promise<Workspace | null> {
  const result = await pool.query(
    `SELECT DISTINCT w.* FROM workspaces w
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE w.id = $1
       AND (w.owner_id = $2 OR wm.user_id = $2)
       AND w.deleted_at IS NULL`,
    [id, user_id],
  );
  return result.rows[0] || null;
}

async function findAll(owner_id: number): Promise<Workspace[]> {
  const result = await pool.query(
    `SELECT DISTINCT w.* FROM workspaces w
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND w.deleted_at IS NULL
     ORDER BY w.created_at DESC`,
    [owner_id],
  );
  return result.rows;
}

async function create(
  name: string,
  description: string,
  owner_id: number,
): Promise<Workspace> {
  const result = await pool.query(
    "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *",
    [name, description, owner_id],
  );
  return result.rows[0];
}

async function update(
  id: number,
  name: string,
  description: string,
  owner_id: number,
): Promise<Workspace | null> {
  const result = await pool.query(
    "UPDATE workspaces SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 AND owner_id = $4 AND deleted_at IS NULL RETURNING *",
    [name, description, id, owner_id],
  );
  return result.rows[0] || null;
}

async function remove(id: number, owner_id: number): Promise<Workspace | null> {
  const result = await pool.query(
    "UPDATE workspaces SET deleted_at = NOW() WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL RETURNING *",
    [id, owner_id],
  );
  return result.rows[0] || null;
}

export const workspaceRepository = {
  findById,
  findAll,
  create,
  update,
  remove,
};
