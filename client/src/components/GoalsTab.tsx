import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import type { Goal } from "@/types/goal.types";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";

interface GoalsTabProps {
  workspaceId: number;
}

export function GoalsTab({ workspaceId }: GoalsTabProps) {
  const { data: goals, isLoading: loadingGoals } = useGoals(workspaceId);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Metas</h2>
        <CreateGoalDialog workspaceId={workspaceId} />
      </div>

      {loadingGoals ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {goals?.map((goal: Goal) => (
            <GoalCard key={goal.id} goal={goal} workspaceId={workspaceId} />
          ))}
          {goals?.length === 0 && (
            <p className="text-muted-foreground text-sm">Nenhuma meta ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}
