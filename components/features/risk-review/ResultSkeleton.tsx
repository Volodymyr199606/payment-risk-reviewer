import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ResultSkeleton() {
  return (
    <div className="space-y-10">
      <Card variant="emphasis" className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)]">
          <div className="space-y-3 border-l-[5px] border-slate-200 bg-slate-100/80 p-6 pl-5 sm:p-8 sm:pl-6">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-12 w-48 max-w-full" />
            <Skeleton className="h-4 w-full max-w-sm" />
          </div>
          <div className="space-y-3 border-t border-slate-200/90 bg-white p-6 md:border-t-0 md:border-l md:border-slate-200/90">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-3 w-full max-w-xs" />
          </div>
        </div>
      </Card>

      <div className="space-y-2.5">
        <Skeleton className="h-3 w-36" />
        <Card variant="emphasis" className="p-4">
          <div className="divide-y divide-slate-100">
            <Skeleton className="h-12 w-full py-2" />
            <Skeleton className="h-12 w-full py-2" />
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
          <Skeleton className="mt-4 h-20 w-full rounded-md" />
        </Card>
        <Card variant="muted">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="mt-4 h-2 w-full rounded-full" />
          <Skeleton className="mt-4 h-10 w-full" />
        </Card>
      </div>
    </div>
  );
}
