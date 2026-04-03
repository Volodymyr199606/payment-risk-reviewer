import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function barTone(pct: number): { bar: string; label: string } {
  if (pct >= 72)
    return {
      bar: "bg-emerald-600",
      label: "text-emerald-800",
    };
  if (pct >= 48)
    return {
      bar: "bg-amber-500",
      label: "text-amber-900",
    };
  return {
    bar: "bg-slate-500",
    label: "text-slate-700",
  };
}

function cardTint(pct: number): string {
  if (pct >= 72) return "border-emerald-200/80 bg-emerald-50/40";
  if (pct >= 48) return "border-amber-200/70 bg-amber-50/35";
  return "border-slate-200/90 bg-slate-50/50";
}

export function ConfidenceCard({
  confidence,
  notes,
}: {
  confidence: number;
  notes: string;
}) {
  const pct = Math.round(confidence * 100);
  const tone = barTone(pct);

  return (
    <Card
      variant="muted"
      className={cn(
        "h-full border p-5 transition-colors duration-200 sm:p-6",
        cardTint(pct),
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Rule confidence
        </p>
        <div className="text-right">
          <span
            className={cn(
              "text-3xl font-bold tabular-nums tracking-tight",
              tone.label,
            )}
          >
            {pct}
          </span>
          <span className="ml-0.5 text-lg font-semibold text-slate-500">%</span>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-slate-200/90 ring-1 ring-slate-200/60">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300 ease-out",
              tone.bar,
            )}
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
