import "dotenv/config";
import pool from "../../database";

async function migrate() {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE workspace_role AS ENUM ('owner', 'editor', 'viewer');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS workspace_members (
      id SERIAL PRIMARY KEY,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role workspace_role NOT NULL DEFAULT 'viewer',
      invited_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(workspace_id, user_id)
    )
  `);

  console.log("Migration 002_workspace_members concluída.");
  process.exit(0);
}

migrate();
