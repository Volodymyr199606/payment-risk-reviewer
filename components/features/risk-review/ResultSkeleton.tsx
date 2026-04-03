import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
  return (
    <div className="space-y-10">
      <Card variant="emphasis" className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-2">
          <div className="space-y-3 border-l-4 border-slate-200 p-6 pl-5">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-3 w-full max-w-sm" />
          </div>
          <div className="space-y-3 border-t border-slate-100 p-6 md:border-t-0 md:border-l md:border-slate-100">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-3 w-full max-w-xs" />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Skeleton className="h-3 w-36" />
        <Card variant="emphasis">
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <Skeleton className="h-3 w-40" />
        <Card variant="muted">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-4/5" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="muted">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-4 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-full" />
        </Card>
        <Card variant="muted">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
          <Skeleton className="mt-4 h-3 w-full" />
        </Card>
      </div>
    </div>
  );
}
