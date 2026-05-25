import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import {
  useToggleGoal,
  useDeleteGoal,
  useUpdateGoalProgress,
} from "@/hooks/useGoals";
import type { Goal } from "@/types/goal.types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function GoalCard({
  goal,
  workspaceId,
}: {
  goal: Goal;
  workspaceId: number;
}) {
  const toggleGoal = useToggleGoal(workspaceId);
  const deleteGoal = useDeleteGoal(workspaceId);
  const updateProgress = useUpdateGoalProgress(workspaceId);
  const [progress, setProgress] = useState(String(goal.current_value));

  const percentage = goal.target_value
    ? Math.min(Math.round((goal.current_value / goal.target_value) * 100), 100)
    : 0;

  function handleProgressUpdate() {
    const value = Number(progress);
    if (isNaN(value) || value < 0) return;
    updateProgress.mutate({ id: goal.id, current_value: value });
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle
            className={`text-sm font-medium ${goal.completed ? "line-through text-muted-foreground" : ""}`}
          >
            {goal.title}
          </CardTitle>
          {goal.type === "qualitative" && (
            <Checkbox
              checked={goal.completed}
              onCheckedChange={(checked) =>
                toggleGoal.mutate({ id: goal.id, completed: !!checked })
              }
            />
          )}
        </div>
        {goal.description && (
          <p className="text-xs text-muted-foreground">{goal.description}</p>
        )}
      </CardHeader>

      {goal.type === "quantitative" && (
        <CardContent className="space-y-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {goal.current_value} / {goal.target_value} ({percentage}%)
          </p>
          <div className="flex gap-2">
            <Input
              type="number"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="h-7 text-sm"
              min={0}
              max={goal.target_value ?? undefined}
            />
            <Button
              size="sm"
              onClick={handleProgressUpdate}
              disabled={updateProgress.isPending}
            >
              Atualizar
            </Button>
          </div>
        </CardContent>
      )}

      <CardFooter className="pt-2">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost" size="icon">
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir meta?</AlertDialogTitle>
              <AlertDialogDescription>
                "{goal.title}" será excluída permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteGoal.mutate(goal.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
