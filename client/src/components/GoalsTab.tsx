import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalCard } from "@/components/GoalCard";
import { CreateGoalDialog } from "@/components/CreateGoalDialog";
import type { Goal } from "@/types/goal.types";
import { CardGridSkeleton } from "@/components/skeletons/CardGridSkeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AiGoalSuggestionDialog } from "@/components/AiGoalSuggestionDialog";

interface GoalsTabProps {
  workspaceId: number;
}

export function GoalsTab({ workspaceId }: GoalsTabProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading: loadingGoals } = useGoals(workspaceId, page);

  const goals = data?.items ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / 10);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Metas</h2>
        <div className="flex gap-2">
          <AiGoalSuggestionDialog workspaceId={workspaceId} />
          <CreateGoalDialog workspaceId={workspaceId} />
        </div>
      </div>

      {loadingGoals ? (
        <CardGridSkeleton count={4} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {goals.map((goal: Goal) => (
              <GoalCard key={goal.id} goal={goal} workspaceId={workspaceId} />
            ))}
            {goals.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Nenhuma meta ainda.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => p - 1)}
                    aria-disabled={page === 1}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm text-muted-foreground px-4">
                    Página {page} de {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => p + 1)}
                    aria-disabled={page === totalPages}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}
