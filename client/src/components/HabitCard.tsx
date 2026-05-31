import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Flame, CheckCircle } from "lucide-react";
import { useCompleteHabit, useDeleteHabit } from "@/hooks/useHabits";
import type { Habit } from "@/types/habit.types";
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
import { EditHabitDialog } from "@/components/EditHabitDialog";

export function HabitCard({
  habit,
  workspaceId,
}: {
  habit: Habit;
  workspaceId: number;
}) {
  const completeHabit = useCompleteHabit(workspaceId);
  const deleteHabit = useDeleteHabit(workspaceId);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{habit.title}</CardTitle>
        {habit.description && (
          <p className="text-xs text-muted-foreground">{habit.description}</p>
        )}
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center gap-1 text-orange-500">
          <Flame className="size-4" />
          <span className="text-sm font-semibold">{habit.streak}</span>
          <span className="text-xs text-muted-foreground">dias seguidos</span>
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button
          size="sm"
          onClick={() => completeHabit.mutate(habit.id)}
          disabled={completeHabit.isPending}
          className="flex-1"
        >
          <CheckCircle className="size-4 mr-1" />
          Completar hoje
        </Button>
        <EditHabitDialog habit={habit} workspaceId={workspaceId} />

        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="ghost" size="icon">
              <Trash2 className="size-4 text-muted-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir hábito?</AlertDialogTitle>
              <AlertDialogDescription>
                "{habit.title}" e todo seu histórico serão excluídos
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteHabit.mutate(habit.id)}>
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
