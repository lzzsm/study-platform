import { analyticsRepository } from "../repositories/analyticsRepository";

async function getAnalytics(owner_id: number) {
  const [taskStats, pendingHabits, topGoals, bestStreak] = await Promise.all([
    analyticsRepository.getTaskStats(owner_id),
    analyticsRepository.getPendingHabitsToday(owner_id),
    analyticsRepository.getTopGoals(owner_id),
    analyticsRepository.getBestStreak(owner_id),
  ]);

  return {
    tasks: {
      pending: Number(taskStats.pending),
      completed: Number(taskStats.completed),
    },
    habits: {
      pending: pendingHabits,
    },
    goals: {
      top5: topGoals,
    },
    bestStreak,
  };
}

export const analyticsService = { getAnalytics };
