import type { FlaggedSignal } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

function severityVariant(
  s: FlaggedSignal["severity"],
): "neutral" | "warning" | "danger" {
  if (s === "critical") return "danger";
  if (s === "warning") return "warning";
  return "neutral";
}

function rowAccent(s: FlaggedSignal["severity"]): string {
  if (s === "critical") return "bg-rose-500";
  if (s === "warning") return "bg-amber-400";
  return "bg-sky-400";
}

export function FlaggedSignalsCard({
  signals,
}: {
  signals: FlaggedSignal[];
}) {
  const count = signals.length;

  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SectionLabel>Flagged signals</SectionLabel>
        <span className="text-[11px] font-medium tabular-nums text-sky-800/80">
          {count === 0 ? "None" : `${count} active`}
        </span>
      </div>
      <Card variant="emphasis" className="p-0 sm:p-0">
        {count === 0 ? (
          <p className="p-4 text-sm leading-relaxed text-slate-600 sm:p-5">
            No rule-based signals fired for this transaction. Continue to
            monitor velocity and dispute patterns outside this review.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {signals.map((s) => (
              <li
                key={s.code}
                className="group flex gap-3 px-3 py-2 transition-colors duration-150 hover:bg-slate-50/80 sm:px-4 sm:py-2.5"
              >
                <span
                  className={cn(
                    "mt-1.5 h-8 w-1 shrink-0 rounded-full",
                    rowAccent(s.severity),
                  )}
                  aria-hidden
                />
                <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-2 sm:items-center">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-slate-900">
                      {s.label}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-tight text-slate-400/90">
                      {s.code}
                    </p>
                  </div>
                  <Badge
                    variant={severityVariant(s.severity)}
                    className="h-5 shrink-0 px-1.5 py-0 text-[9px] font-semibold uppercase tracking-wider"
                  >
                    {s.severity}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
