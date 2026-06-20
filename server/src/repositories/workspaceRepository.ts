import pool from "../database";
import { PoolClient } from "pg";
import { Workspace } from "../types/workspace.types";
import { PaginatedResult } from "../types/pagination.types";

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

async function findAll(
  owner_id: number,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResult<Workspace>> {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT w.id) AS total FROM workspaces w
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND w.deleted_at IS NULL`,
    [owner_id],
  );

  const result = await pool.query(
    `SELECT DISTINCT w.* FROM workspaces w
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND w.deleted_at IS NULL
     ORDER BY w.created_at DESC
     LIMIT $2 OFFSET $3`,
    [owner_id, limit, offset],
  );

  return {
    items: result.rows,
    total: Number(countResult.rows[0].total),
    page,
  };
}

async function create(
  name: string,
  description: string,
  owner_id: number,
  client?: PoolClient,
): Promise<Workspace> {
  const db = client ?? pool;
  const result = await db.query(
    `INSERT INTO workspaces (name, description, owner_id)
     VALUES ($1, $2, $3) RETURNING *`,
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
