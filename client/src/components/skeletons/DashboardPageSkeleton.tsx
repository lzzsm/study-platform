import { Skeleton } from "@/components/ui/skeleton";
import { StatsSkeleton } from "./StatsSkeleton";
import { CardGridSkeleton } from "./CardGridSkeleton";

export function DashboardPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      <StatsSkeleton />

      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <CardGridSkeleton count={3} />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <CardGridSkeleton count={3} />
      </div>
    </div>
  );
}
