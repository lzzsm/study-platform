import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Flame } from "lucide-react";
import { TasksChart } from "@/components/charts/TasksChart";
import { GoalsChart } from "@/components/charts/GoalsChart";
import { GoalsProgressChart } from "@/components/charts/GoalsProgressChart";
import type { Habit } from "@/types/habit.types";
import type { useCompleteHabitFromDashboard } from "@/hooks/useHabits";

interface GoalProgress {
  title: string;
  progress_pct: number;
}

interface DashboardChartsProps {
  analytics: {
    tasks: { pending: number; completed: number };
    goals: {
      stats: { completed: number; inProgress: number; notStarted: number };
      top5: GoalProgress[];
    };
    habits: { pending: Habit[] };
  };
  completeHabit: ReturnType<typeof useCompleteHabitFromDashboard>;
}

export function DashboardCharts({
  analytics,
  completeHabit,
}: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tarefas */}
      <Card className="border-0 bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksChart
            pending={analytics.tasks.pending}
            completed={analytics.tasks.completed}
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
            completed={analytics.goals.stats.completed}
            inProgress={analytics.goals.stats.inProgress}
            notStarted={analytics.goals.stats.notStarted}
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
          <GoalsProgressChart goals={analytics.goals.top5} />
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
          {analytics.habits.pending.length === 0 ? (
            <div className="pt-4 pb-2 text-center">
              <CheckCircle className="size-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Todos os hábitos feitos hoje!
              </p>
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {analytics.habits.pending.map((habit: Habit) => (
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
  );
}
