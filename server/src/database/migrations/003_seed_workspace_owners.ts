import "dotenv/config";
import pool from "../../database";

async function migrate() {
  // Para cada workspace existente, insere o owner como membro
  // se ainda não existir na tabela
  await pool.query(`
    INSERT INTO workspace_members (workspace_id, user_id, role, invited_by)
    SELECT w.id, w.owner_id, 'owner', w.owner_id
    FROM workspaces w
    WHERE NOT EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = w.id AND wm.user_id = w.owner_id
    )
  `);

  console.log("Migration 003_seed_workspace_owners concluída.");
  process.exit(0);
}

migrate();
