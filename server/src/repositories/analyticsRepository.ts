import pool from "../database";

async function getTaskStats(owner_id: number) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE completed = false) AS pending,
      COUNT(*) FILTER (WHERE completed = true) AS completed
     FROM tasks t
     JOIN workspaces w ON w.id = t.workspace_id
     WHERE w.owner_id = $1
       AND t.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [owner_id],
  );
  return result.rows[0];
}

async function getPendingHabitsToday(owner_id: number) {
  const result = await pool.query(
    `SELECT h.* FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     LEFT JOIN habit_logs hl
       ON hl.habit_id = h.id
       AND hl.completed_at = CURRENT_DATE
     WHERE w.owner_id = $1
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL
       AND hl.id IS NULL`,
    [owner_id],
  );
  return result.rows;
}

async function getTopGoals(owner_id: number) {
  const result = await pool.query(
    `SELECT g.*,
      CASE
        WHEN g.type = 'qualitative' THEN
          CASE WHEN g.completed THEN 100 ELSE 0 END
        WHEN g.target_value > 0 THEN
          ROUND((g.current_value::numeric / g.target_value) * 100)
        ELSE 0
      END AS progress_pct
     FROM goals g
     JOIN workspaces w ON w.id = g.workspace_id
     WHERE w.owner_id = $1
       AND g.deleted_at IS NULL
       AND w.deleted_at IS NULL
     ORDER BY progress_pct DESC
     LIMIT 5`,
    [owner_id],
  );
  return result.rows;
}

async function getBestStreak(owner_id: number) {
  const result = await pool.query(
    `SELECT COALESCE(MAX(h.streak), 0) AS best_streak
     FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     WHERE w.owner_id = $1
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [owner_id],
  );
  return Number(result.rows[0].best_streak);
}

async function getGoalStats(owner_id: number) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE 
        (type = 'qualitative' AND completed = true) OR
        (type = 'quantitative' AND current_value >= target_value)
      ) AS completed,
      COUNT(*) FILTER (WHERE 
        (type = 'qualitative' AND completed = false) OR
        (type = 'quantitative' AND current_value > 0 AND current_value < target_value)
      ) AS in_progress,
      COUNT(*) FILTER (WHERE 
        type = 'quantitative' AND current_value = 0
      ) AS not_started
     FROM goals g
     JOIN workspaces w ON w.id = g.workspace_id
     WHERE w.owner_id = $1
       AND g.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [owner_id],
  );
  return result.rows[0];
}

export const analyticsRepository = {
  getTaskStats,
  getPendingHabitsToday,
  getTopGoals,
  getGoalStats,
  getBestStreak,
};
