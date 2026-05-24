import pool from "../database";
import { Workspace } from "../types/workspace.types";

async function findById(
  id: number,
  owner_id: number,
): Promise<Workspace | null> {
  const result = await pool.query(
    "SELECT * FROM workspaces WHERE id = $1 AND owner_id = $2 AND deleted_at IS NULL",
    [id, owner_id],
  );
  return result.rows[0] || null;
}

async function findAll(owner_id: number): Promise<Workspace[]> {
  const result = await pool.query(
    "SELECT * FROM workspaces WHERE owner_id = $1 AND deleted_at IS NULL",
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
