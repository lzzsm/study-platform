import "dotenv/config";
import pool from "../../database";

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workspace_invites (
      id SERIAL PRIMARY KEY,
      workspace_id INTEGER REFERENCES workspaces(id) ON DELETE CASCADE,
      inviter_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      invitee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      role workspace_role NOT NULL DEFAULT 'viewer',
      status TEXT NOT NULL DEFAULT 'pending',
      rejected_count INTEGER NOT NULL DEFAULT 0,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(workspace_id, invitee_id)
    )
  `);

  console.log("Migration 006_workspace_invites concluída.");
  process.exit(0);
}

migrate();
