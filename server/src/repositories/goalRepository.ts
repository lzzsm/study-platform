import pool from "../database";
import { Goal } from "../types/goal.types";
import { PaginatedResult } from "../types/pagination.types";

async function findById(
  id: number,
  workspace_id: number,
): Promise<Goal | null> {
  const result = await pool.query(
    "SELECT * FROM goals WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL",
    [id, workspace_id],
  );
  return result.rows[0] || null;
}

async function findAll(
  workspace_id: number,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResult<Goal>> {
  const offset = (page - 1) * limit;

  const countResult = await pool.query(
    `SELECT COUNT(*) AS total FROM goals
     WHERE workspace_id = $1 AND deleted_at IS NULL`,
    [workspace_id],
  );

  const result = await pool.query(
    `SELECT * FROM goals
     WHERE workspace_id = $1 AND deleted_at IS NULL
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [workspace_id, limit, offset],
  );

  return {
    items: result.rows,
    total: Number(countResult.rows[0].total),
    page,
  };
}

async function create(
  title: string,
  description: string | null,
  type: "quantitative" | "qualitative",
  target_value: number | null,
  expires_at: string | null,
  workspace_id: number,
): Promise<Goal> {
  const result = await pool.query(
    `INSERT INTO goals (title, description, type, target_value, expires_at, workspace_id)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, description, type, target_value, expires_at, workspace_id],
  );
  return result.rows[0];
}

async function update(
  id: number,
  title: string,
  description: string | null,
  target_value: number | null,
  expires_at: string | null,
): Promise<Goal | null> {
  const result = await pool.query(
    `UPDATE goals SET title = $1, description = $2, target_value = $3, expires_at = $4, updated_at = NOW()
     WHERE id = $5 AND deleted_at IS NULL RETURNING *`,
    [title, description, target_value, expires_at, id],
  );
  return result.rows[0] || null;
}

async function updateProgress(
  id: number,
  current_value: number,
): Promise<Goal | null> {
  const result = await pool.query(
    "UPDATE goals SET current_value = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *",
    [current_value, id],
  );
  return result.rows[0] || null;
}

async function toggleCompleted(
  id: number,
  completed: boolean,
): Promise<Goal | null> {
  const result = await pool.query(
    "UPDATE goals SET completed = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *",
    [completed, id],
  );
  return result.rows[0] || null;
}

async function remove(id: number): Promise<Goal | null> {
  const result = await pool.query(
    "UPDATE goals SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
    [id],
  );
  return result.rows[0] || null;
}

export const goalRepository = {
  findById,
  findAll,
  create,
  update,
  updateProgress,
  toggleCompleted,
  remove,
};
