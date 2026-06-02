import { useMe } from "@/hooks/useMe";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCompleteHabitFromDashboard } from "@/hooks/useHabits";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Flame,
  Target,
} from "lucide-react";
import type { Workspace } from "@/types/workspace.types";
import type { Habit } from "@/types/habit.types";
import type { Goal } from "@/types/goal.types";
import { TasksChart } from "@/components/charts/TasksChart";
import { GoalsChart } from "@/components/charts/GoalsChart";
import { HabitsChart } from "@/components/charts/HabitsChart";
import { GoalsProgressChart } from "@/components/charts/GoalsProgressChart";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

function DashboardPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: loadingUser } = useMe();
  const { data: workspaces, isLoading: loadingWorkspaces } = useWorkspaces();
  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics();
  const completeHabit = useCompleteHabitFromDashboard();

  if (loadingUser || loadingWorkspaces || loadingAnalytics)
    return <DashboardPageSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {user?.name} 👋</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              Tarefas pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.tasks.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="size-4" />
              Tarefas completas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.tasks.completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="size-4" />
              Melhor streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.bestStreak} dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="size-4" />
              Hábitos pendentes hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {analytics?.habits.pending.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksChart
              pending={analytics?.tasks.pending ?? 0}
              completed={analytics?.tasks.completed ?? 0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsChart
              completed={analytics?.goals.stats.completed ?? 0}
              inProgress={analytics?.goals.stats.inProgress ?? 0}
              notStarted={analytics?.goals.stats.notStarted ?? 0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top hábitos por streak</CardTitle>
          </CardHeader>
          <CardContent>
            <HabitsChart habits={analytics?.habits.top5 ?? []} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Progresso das metas</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsProgressChart goals={analytics?.goals.top5 ?? []} />
          </CardContent>
        </Card>
      </div>

      {/* Hábitos pendentes hoje */}
      {(analytics?.habits.pending.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Hábitos para hoje</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analytics!.habits.pending.map((habit: Habit) => (
              <Card
                key={habit.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="text-sm font-medium">{habit.title}</p>
                  <div className="flex items-center gap-1 text-orange-500 mt-1">
                    <Flame className="size-3" />
                    <span className="text-xs">{habit.streak} dias</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    completeHabit.mutate({
                      habitId: habit.id,
                      workspaceId: habit.workspace_id,
                    })
                  }
                  disabled={completeHabit.isPending}
                >
                  <CheckCircle className="size-4" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Top metas */}
      {(analytics?.goals.top5.length ?? 0) > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Progresso das metas</h2>
          <div className="space-y-3">
            {analytics!.goals.top5.map(
              (goal: Goal & { progress_pct: number }) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{goal.title}</p>
                    <span className="text-sm text-muted-foreground">
                      {goal.progress_pct}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress_pct}%` }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      )}

      {/* Workspaces */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Seus workspaces</h2>
          <Button size="sm" onClick={() => navigate("/workspaces")}>
            <Plus />
            Novo
          </Button>
        </div>

        {workspaces?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum workspace ainda.{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => navigate("/workspaces")}
            >
              Crie o primeiro.
            </span>
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces?.map((workspace: Workspace) => (
              <Card
                key={workspace.id}
                className="cursor-pointer hover:border-foreground/30 transition-colors"
                onClick={() => navigate(`/workspaces/${workspace.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="size-4" />
                    {workspace.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {workspace.description || "Sem descrição"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
