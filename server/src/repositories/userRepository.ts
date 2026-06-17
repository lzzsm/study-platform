import pool from "../database";
import { User } from "../types/user.types";

// uso interno — retorna password pra comparação
async function findById(id: number): Promise<User | null> {
  const result = await pool.query(
    "SELECT id, name, email, password, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0] || null;
}

// uso externo — nunca expõe password
async function findPublicById(
  id: number,
): Promise<Omit<User, "password"> | null> {
  const result = await pool.query(
    "SELECT id, name, email, avatar_url, bio, created_at, updated_at FROM users WHERE id = $1",
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

async function updateProfile(
  id: number,
  name: string,
  bio: string | null,
  avatar_url: string | null,
): Promise<User | null> {
  const result = await pool.query(
    `UPDATE users SET name = $1, bio = $2, avatar_url = $3, updated_at = NOW()
     WHERE id = $4 RETURNING id, name, email, avatar_url, bio, created_at, updated_at`,
    [name, bio, avatar_url, id],
  );
  return result.rows[0] || null;
}

async function updatePassword(
  id: number,
  hashedPassword: string,
): Promise<void> {
  await pool.query(
    `UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2`,
    [hashedPassword, id],
  );
}

async function remove(id: number): Promise<void> {
  await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id],
  );
}

export const userRepository = {
  findById,
  findPublicById,
  findByEmail,
  create,
  updateProfile,
  updatePassword,
  remove,
};
