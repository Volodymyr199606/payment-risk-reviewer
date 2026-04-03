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
      <p className="text-xs font-semibold text-slate-700">
        Evaluation confidence
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>Score</span>
            <span className="tabular-nums font-semibold text-slate-800">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
            <div
              className="h-full rounded-full bg-slate-700 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="text-sm leading-[1.65] text-slate-600">{notes}</p>
      </div>
    </Card>
  );
}
