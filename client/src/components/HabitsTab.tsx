import { useState } from "react";
import { useHabits, useCreateHabit } from "@/hooks/useHabits";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HabitCard } from "@/components/HabitCard";
import type { Habit } from "@/types/habit.types";
import { HabitGridSkeleton } from "@/components/skeletons/HabitGridSkeleton";

interface HabitsTabProps {
  workspaceId: number;
}

export function HabitsTab({ workspaceId }: HabitsTabProps) {
  const { data: habits, isLoading: loadingHabits } = useHabits(workspaceId);
  const createHabit = useCreateHabit(workspaceId);

  const [habitTitle, setHabitTitle] = useState("");
  const [habitDescription, setHabitDescription] = useState("");

  function handleCreateHabit() {
    if (!habitTitle.trim()) return;
    createHabit.mutate(
      { title: habitTitle, description: habitDescription || undefined },
      {
        onSuccess: () => {
          setHabitTitle("");
          setHabitDescription("");
        },
      },
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Formulário de criação */}
      <div className="space-y-2">
        <Input
          value={habitTitle}
          onChange={(e) => setHabitTitle(e.target.value)}
          placeholder="Novo hábito..."
          onKeyDown={(e) => e.key === "Enter" && handleCreateHabit()}
        />
        <Input
          value={habitDescription}
          onChange={(e) => setHabitDescription(e.target.value)}
          placeholder="Descrição (opcional)"
        />
        <Button
          onClick={handleCreateHabit}
          disabled={createHabit.isPending}
          size="sm"
        >
          <Plus className="size-4 mr-1" />
          {createHabit.isPending ? "Criando..." : "Criar hábito"}
        </Button>
      </div>

      {/* Lista de hábitos */}
      {loadingHabits ? (
        <HabitGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {habits?.map((habit: Habit) => (
            <HabitCard key={habit.id} habit={habit} workspaceId={workspaceId} />
          ))}
          {habits?.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Nenhum hábito ainda.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
