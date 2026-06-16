import pool from "../database";
import { RefreshToken } from "../types/refreshToken.types";

async function create(
  user_id: number,
  token_hash: string,
  expires_at: Date,
): Promise<RefreshToken> {
  const result = await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3) RETURNING *`,
    [user_id, token_hash, expires_at],
  );
  return result.rows[0];
}

async function findByUser(user_id: number): Promise<RefreshToken[]> {
  const result = await pool.query(
    `SELECT * FROM refresh_tokens WHERE user_id = $1 AND expires_at > NOW()`,
    [user_id],
  );
  return result.rows;
}

async function remove(id: number): Promise<void> {
  await pool.query(`DELETE FROM refresh_tokens WHERE id = $1`, [id]);
}

async function removeAllByUser(user_id: number): Promise<void> {
  await pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [user_id]);
}

export const refreshTokenRepository = {
  create,
  findByUser,
  remove,
  removeAllByUser,
};
