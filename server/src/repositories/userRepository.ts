import pool from "../database";
import { User } from "../types/user.types";

async function findById(id: number): Promise<User | null> {
  const result = await pool.query(
    "SELECT id, name, email, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
}

async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
}

async function create(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const result = await pool.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password],
  );
  return result.rows[0];
}

export const userRepository = {
  findById,
  findByEmail,
  create,
};
