import "dotenv/config";
import pool from "../../database";

async function migrate() {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_user
    ON workspace_members (workspace_id, user_id);
  `);

  console.log("Migration 004_workspace_members_index concluída.");
  process.exit(0);
}

migrate();
