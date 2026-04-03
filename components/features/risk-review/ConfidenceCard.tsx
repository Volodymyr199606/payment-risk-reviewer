import { Card } from "@/components/ui/card";

export function ConfidenceCard({
  confidence,
  notes,
}: {
  confidence: number;
  notes: string;
}) {
  const pct = Math.round(confidence * 100);
  return (
    <Card variant="muted" className="h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Rule confidence
        </p>
        <span className="text-2xl font-bold tabular-nums tracking-tight text-slate-900">
          {pct}
          <span className="text-base font-semibold text-slate-500">%</span>
        </span>
      </div>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200/90">
          <div
            className="h-full rounded-full bg-slate-800 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 text-xs font-medium leading-relaxed text-slate-600">
          {notes}
        </p>
      </div>
    </Card>
  );
}
