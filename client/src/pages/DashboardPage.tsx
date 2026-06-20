import { useMe } from "@/hooks/useMe";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCompleteHabitFromDashboard } from "@/hooks/useHabits";
import { useTabsStore } from "@/store/tabsStore";
import type { Workspace } from "@/types/workspace.types";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { DashboardQuickNav } from "@/components/DashboardQuickNav";
import { DashboardCharts } from "@/components/charts/DashboardCharts";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

function DashboardPage() {
  const { data: user, isLoading: loadingUser } = useMe();
  const { data: workspacesData, isLoading: loadingWorkspaces } =
    useWorkspaces();
  const workspacesList = workspacesData?.items ?? [];
  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics();
  const completeHabit = useCompleteHabitFromDashboard();
  const { tabs } = useTabsStore();

  if (loadingUser || loadingWorkspaces || loadingAnalytics)
    return <DashboardPageSkeleton />;

  const recentWorkspaces =
    tabs.length > 0
      ? workspacesList.filter((w: Workspace) => tabs.some((t) => t.id === w.id))
      : workspacesList.slice(0, 3);

  return (
    <div className="space-y-8">
      <DashboardHeader name={user?.name} avatarUrl={user?.avatar_url} />

      <DashboardStats
        pendingTasks={analytics?.tasks.pending ?? 0}
        completedTasks={analytics?.tasks.completed ?? 0}
        bestStreak={analytics?.bestStreak ?? 0}
        pendingHabits={analytics?.habits.pending.length ?? 0}
      />

      <DashboardQuickNav recentWorkspaces={recentWorkspaces} />

      {analytics && (
        <DashboardCharts analytics={analytics} completeHabit={completeHabit} />
      )}
    </div>
  );
}

export default DashboardPage;
