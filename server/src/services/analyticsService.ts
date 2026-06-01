import { analyticsRepository } from "../repositories/analyticsRepository";

async function getAnalytics(owner_id: number) {
  const [taskStats, pendingHabits, topGoals, bestStreak, goalStats, topHabits] =
    await Promise.all([
      analyticsRepository.getTaskStats(owner_id),
      analyticsRepository.getPendingHabitsToday(owner_id),
      analyticsRepository.getTopGoals(owner_id),
      analyticsRepository.getBestStreak(owner_id),
      analyticsRepository.getGoalStats(owner_id),
      analyticsRepository.getTopHabits(owner_id),
    ]);

  return {
    tasks: {
      pending: Number(taskStats.pending),
      completed: Number(taskStats.completed),
    },
    habits: {
      pending: pendingHabits,
      top5: topHabits,
    },
    goals: {
      top5: topGoals,
      stats: {
        completed: Number(goalStats.completed),
        inProgress: Number(goalStats.in_progress),
        notStarted: Number(goalStats.not_started),
      },
    },
    bestStreak,
  };
}

export const analyticsService = { getAnalytics };
