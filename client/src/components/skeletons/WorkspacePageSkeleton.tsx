import { Skeleton } from "@/components/ui/skeleton";
import { TaskListSkeleton } from "./TaskListSkeleton";
import { CardGridSkeleton } from "./CardGridSkeleton";
import { HabitGridSkeleton } from "./HabitGridSkeleton";

export function WorkspacePageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Skeleton className="size-6 rounded" />
        <div className="space-y-1">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-24" />
        <TaskListSkeleton />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-16" />
        <CardGridSkeleton count={2} />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-20" />
        <HabitGridSkeleton count={2} />
      </div>
    </div>
  );
}
