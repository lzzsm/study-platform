import pool from "../database";
import { Task } from "../types/task.types";

async function findById(
  id: number,
  workspace_id: number,
): Promise<Task | null> {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL",
    [id, workspace_id],
  );
  return result.rows[0] || null;
}

async function findAll(
  workspace_id: number,
  page: number = 1,
  limit: number = 10,
  status?: "pending" | "completed",
): Promise<{ tasks: Task[]; total: number }> {
  const offset = (page - 1) * limit;
  const conditions = ["workspace_id = $1", "deleted_at IS NULL"];
  const params: unknown[] = [workspace_id];

  if (status === "pending") {
    conditions.push(`completed = false`);
  } else if (status === "completed") {
    conditions.push(`completed = true`);
  }

  const where = `WHERE ${conditions.join(" AND ")}`;

  const countResult = await pool.query(
    `SELECT COUNT(*) as total FROM tasks ${where}`,
    params,
  );

  const tasksResult = await pool.query(
    `SELECT * FROM tasks ${where} ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset],
  );

  return {
    tasks: tasksResult.rows,
    total: Number(countResult.rows[0].total),
  };
}

async function create(
  title: string,
  description: string | null,
  workspace_id: number,
): Promise<Task> {
  const result = await pool.query(
    "INSERT INTO tasks (title, description, workspace_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, workspace_id],
  );
  return result.rows[0];
}

async function update(
  id: number,
  title: string,
  description: string | null,
): Promise<Task | null> {
  const result = await pool.query(
    "UPDATE tasks SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 AND deleted_at IS NULL RETURNING *",
    [title, description, id],
  );
  return result.rows[0] || null;
}

async function remove(id: number): Promise<Task | null> {
  const result = await pool.query(
    "UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
    [id],
  );
  return result.rows[0] || null;
}

async function toggleCompleted(
  id: number,
  completed: boolean,
): Promise<Task | null> {
  const result = await pool.query(
    "UPDATE tasks SET completed = $1, updated_at = NOW() WHERE id = $2 AND deleted_at IS NULL RETURNING *",
    [completed, id],
  );
  return result.rows[0] || null;
}

export const taskRepository = {
  findById,
  findAll,
  create,
  update,
  remove,
  toggleCompleted,
};
