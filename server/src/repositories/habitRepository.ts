import pool from "../database";
import { Habit, HabitLog } from "../types/habit.types";

async function findById(
  id: number,
  workspace_id: number,
): Promise<Habit | null> {
  const result = await pool.query(
    "SELECT * FROM habits WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL",
    [id, workspace_id],
  );
  return result.rows[0] || null;
}

async function findAll(workspace_id: number): Promise<Habit[]> {
  const result = await pool.query(
    "SELECT * FROM habits WHERE workspace_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC",
    [workspace_id],
  );
  return result.rows;
}

async function create(
  title: string,
  description: string | null,
  workspace_id: number,
): Promise<Habit> {
  const result = await pool.query(
    "INSERT INTO habits (title, description, workspace_id) VALUES ($1, $2, $3) RETURNING *",
    [title, description, workspace_id],
  );
  return result.rows[0];
}

async function update(
  id: number,
  title: string,
  description: string | null,
): Promise<Habit | null> {
  const result = await pool.query(
    "UPDATE habits SET title = $1, description = $2, updated_at = NOW() WHERE id = $3 AND deleted_at IS NULL RETURNING *",
    [title, description, id],
  );
  return result.rows[0] || null;
}

async function remove(id: number): Promise<Habit | null> {
  const result = await pool.query(
    "UPDATE habits SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *",
    [id],
  );
  return result.rows[0] || null;
}

async function logToday(habit_id: number): Promise<HabitLog | null> {
  try {
    const result = await pool.query(
      "INSERT INTO habit_logs (habit_id) VALUES ($1) RETURNING *",
      [habit_id],
    );
    return result.rows[0];
  } catch {
    return null;
  }
}

async function wasCompletedYesterday(habit_id: number): Promise<boolean> {
  const result = await pool.query(
    "SELECT 1 FROM habit_logs WHERE habit_id = $1 AND completed_at = CURRENT_DATE - INTERVAL '1 day'",
    [habit_id],
  );
  return result.rows.length > 0;
}

async function wasCompletedToday(habit_id: number): Promise<boolean> {
  const result = await pool.query(
    "SELECT 1 FROM habit_logs WHERE habit_id = $1 AND completed_at = CURRENT_DATE",
    [habit_id],
  );
  return result.rows.length > 0;
}

async function incrementStreak(id: number): Promise<Habit | null> {
  const result = await pool.query(
    "UPDATE habits SET streak = streak + 1, updated_at = NOW() WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] || null;
}

async function resetStreak(id: number): Promise<Habit | null> {
  const result = await pool.query(
    "UPDATE habits SET streak = 1, updated_at = NOW() WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] || null;
}

export const habitRepository = {
  findById,
  findAll,
  create,
  update,
  remove,
  logToday,
  wasCompletedYesterday,
  wasCompletedToday,
  incrementStreak,
  resetStreak,
};
