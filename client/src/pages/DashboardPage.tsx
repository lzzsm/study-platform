import { useMe } from "@/hooks/useMe";
import { useWorkspaces } from "@/hooks/useWorkspaces";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCompleteHabitFromDashboard } from "@/hooks/useHabits";
import { useNavigate } from "react-router-dom";
import { useTabsStore } from "@/store/tabsStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Plus,
  CheckCircle,
  Clock,
  Flame,
  Target,
  User,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";
import type { Workspace } from "@/types/workspace.types";
import type { Habit } from "@/types/habit.types";
import { TasksChart } from "@/components/charts/TasksChart";
import { GoalsChart } from "@/components/charts/GoalsChart";
import { GoalsProgressChart } from "@/components/charts/GoalsProgressChart";
import { DashboardPageSkeleton } from "@/components/skeletons/DashboardPageSkeleton";

function DashboardPage() {
  const navigate = useNavigate();
  const { data: user, isLoading: loadingUser } = useMe();
  const { data: workspaces, isLoading: loadingWorkspaces } = useWorkspaces();
  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics();
  const completeHabit = useCompleteHabitFromDashboard();
  const { tabs } = useTabsStore();

  if (loadingUser || loadingWorkspaces || loadingAnalytics)
    return <DashboardPageSkeleton />;

  const recentWorkspaces =
    tabs.length > 0
      ? (workspaces?.filter((w: Workspace) =>
          tabs.some((t) => t.id === w.id),
        ) ?? [])
      : (workspaces?.slice(0, 3) ?? []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
      </div>

      {/* ── STATS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Clock className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.tasks.pending}</p>
                <p className="text-xs text-muted-foreground">
                  Tarefas pendentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <CheckCircle className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {analytics?.tasks.completed}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tarefas completas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Flame className="size-4 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{analytics?.bestStreak}</p>
                <p className="text-xs text-muted-foreground">Melhor streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-background">
                <Target className="size-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {analytics?.habits.pending.length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hábitos pendentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── NAVEGAÇÃO RÁPIDA ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Navegação rápida
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <LayoutDashboard className="size-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/workspaces")}
          >
            <BookOpen className="size-4 mr-2" />
            Workspaces
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/profile")}
          >
            <User className="size-4 mr-2" />
            Perfil
          </Button>

          {recentWorkspaces.length > 0 && (
            <div className="w-px h-8 bg-border self-center mx-1" />
          )}

          {recentWorkspaces.map((workspace: Workspace) => (
            <Button
              key={workspace.id}
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/workspaces/${workspace.id}`)}
            >
              {workspace.name}
              <ArrowRight className="size-3 ml-2" />
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/workspaces")}
          >
            <Plus className="size-4 mr-1" />
            Novo workspace
          </Button>
        </div>
      </div>

      {/* ── GRÁFICOS + HÁBITOS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarefas */}
        <Card className="border-0 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <TasksChart
              pending={analytics?.tasks.pending ?? 0}
              completed={analytics?.tasks.completed ?? 0}
            />
          </CardContent>
        </Card>

        {/* Metas */}
        <Card className="border-0 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsChart
              completed={analytics?.goals.stats.completed ?? 0}
              inProgress={analytics?.goals.stats.inProgress ?? 0}
              notStarted={analytics?.goals.stats.notStarted ?? 0}
            />
          </CardContent>
        </Card>

        {/* Progresso das metas */}
        <Card className="border-0 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Progresso das metas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <GoalsProgressChart goals={analytics?.goals.top5 ?? []} />
          </CardContent>
        </Card>

        {/* Hábitos para hoje */}
        <Card className="border-0 bg-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="size-4 text-orange-500" />
              Hábitos para hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(analytics?.habits.pending.length ?? 0) === 0 ? (
              <div className="pt-4 pb-2 text-center">
                <CheckCircle className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Todos os hábitos feitos hoje!
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {analytics!.habits.pending.map((habit: Habit) => (
                  <div
                    key={habit.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-orange-500">
                        <Flame className="size-3.5" />
                        <span className="text-xs font-medium">
                          {habit.streak}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{habit.title}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        completeHabit.mutate({
                          habitId: habit.id,
                          workspaceId: habit.workspace_id,
                        })
                      }
                      disabled={completeHabit.isPending}
                    >
                      <CheckCircle className="size-3.5 mr-1" />
                      Feito
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
