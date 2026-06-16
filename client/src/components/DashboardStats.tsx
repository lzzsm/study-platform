import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Flame, Target } from "lucide-react";

interface DashboardStatsProps {
  pendingTasks: number;
  completedTasks: number;
  bestStreak: number;
  pendingHabits: number;
}

export function DashboardStats({
  pendingTasks,
  completedTasks,
  bestStreak,
  pendingHabits,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-0 bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-background">
              <Clock className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground">Tarefas pendentes</p>
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
              <p className="text-2xl font-bold">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Tarefas completas</p>
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
              <p className="text-2xl font-bold">{bestStreak}</p>
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
              <p className="text-2xl font-bold">{pendingHabits}</p>
              <p className="text-xs text-muted-foreground">Hábitos pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
