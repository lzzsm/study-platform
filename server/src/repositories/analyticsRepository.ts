import pool from "../database";

async function getTaskStats(user_id: number) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE t.completed = false) AS pending,
      COUNT(*) FILTER (WHERE t.completed = true) AS completed
     FROM tasks t
     JOIN workspaces w ON w.id = t.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND t.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );
  return result.rows[0];
}

async function getPendingHabitsToday(user_id: number) {
  const result = await pool.query(
    `SELECT h.* FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     LEFT JOIN habit_logs hl
       ON hl.habit_id = h.id
       AND hl.completed_at = CURRENT_DATE
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL
       AND hl.id IS NULL`,
    [user_id],
  );
  return result.rows;
}

async function getTopGoals(user_id: number) {
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
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND g.deleted_at IS NULL
       AND w.deleted_at IS NULL
     ORDER BY progress_pct DESC
     LIMIT 5`,
    [user_id],
  );
  return result.rows;
}

async function getBestStreak(user_id: number) {
  const result = await pool.query(
    `SELECT COALESCE(MAX(h.streak), 0) AS best_streak
     FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );
  return Number(result.rows[0].best_streak);
}

async function getGoalStats(user_id: number) {
  const result = await pool.query(
    `SELECT
      COUNT(*) FILTER (WHERE
        (g.type = 'qualitative' AND g.completed = true) OR
        (g.type = 'quantitative' AND g.current_value >= g.target_value)
      ) AS completed,
      COUNT(*) FILTER (WHERE
        (g.type = 'qualitative' AND g.completed = false) OR
        (g.type = 'quantitative' AND g.current_value > 0 AND g.current_value < g.target_value)
      ) AS in_progress,
      COUNT(*) FILTER (WHERE
        g.type = 'quantitative' AND g.current_value = 0
      ) AS not_started
     FROM goals g
     JOIN workspaces w ON w.id = g.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND g.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );
  return result.rows[0];
}

async function getPublicStats(user_id: number) {
  const tasksResult = await pool.query(
    `SELECT COUNT(*) FILTER (WHERE t.completed = true) AS completed_tasks
     FROM tasks t
     JOIN workspaces w ON w.id = t.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND t.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );

  const streakResult = await pool.query(
    `SELECT COALESCE(MAX(h.streak), 0) AS best_streak
     FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );

  const goalsResult = await pool.query(
    `SELECT COUNT(*) FILTER (WHERE
        (g.type = 'qualitative' AND g.completed = true) OR
        (g.type = 'quantitative' AND g.current_value >= g.target_value)
      ) AS completed_goals
     FROM goals g
     JOIN workspaces w ON w.id = g.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND g.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );

  const habitsResult = await pool.query(
    `SELECT COUNT(*) AS active_habits
     FROM habits h
     JOIN workspaces w ON w.id = h.workspace_id
     LEFT JOIN workspace_members wm ON wm.workspace_id = w.id
     WHERE (w.owner_id = $1 OR wm.user_id = $1)
       AND h.deleted_at IS NULL
       AND w.deleted_at IS NULL`,
    [user_id],
  );

  return {
    completedTasks: Number(tasksResult.rows[0].completed_tasks),
    bestStreak: Number(streakResult.rows[0].best_streak),
    completedGoals: Number(goalsResult.rows[0].completed_goals),
    activeHabits: Number(habitsResult.rows[0].active_habits),
  };
}

export const analyticsRepository = {
  getTaskStats,
  getPendingHabitsToday,
  getTopGoals,
  getGoalStats,
  getBestStreak,
  getPublicStats,
};
