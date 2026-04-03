import type { FlaggedSignal } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionLabel } from "@/components/ui/section-label";

function severityVariant(
  s: FlaggedSignal["severity"],
): "neutral" | "warning" | "danger" {
  if (s === "critical") return "danger";
  if (s === "warning") return "warning";
  return "neutral";
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
        <span className="text-[11px] font-medium tabular-nums text-slate-500">
          {count === 0 ? "None" : `${count} active`}
        </span>
      </div>
      <Card variant="emphasis" className="p-4 sm:p-5">
        {count === 0 ? (
          <p className="text-sm leading-relaxed text-slate-600">
            No rule-based signals fired for this transaction. Continue to
            monitor velocity and dispute patterns outside this review.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {signals.map((s) => (
              <li
                key={s.code}
                className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 py-2.5 first:pt-0 last:pb-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-slate-900">
                    {s.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                    {s.code}
                  </p>
                </div>
                <Badge
                  variant={severityVariant(s.severity)}
                  className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                >
                  {s.severity}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
