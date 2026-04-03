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
    <div className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <SectionLabel>Flagged signals</SectionLabel>
        <span className="text-xs tabular-nums text-slate-400">
          {count === 0 ? "None" : `${count} active`}
        </span>
      </div>
      <Card variant="emphasis">
        {count === 0 ? (
          <p className="text-sm leading-relaxed text-slate-600">
            No rule-based signals fired for this transaction. Continue to
            monitor standard velocity and dispute patterns outside this review.
          </p>
        ) : (
          <ul className="space-y-2.5">
            {signals.map((s) => (
              <li
                key={s.code}
                className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/60 px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold leading-snug text-slate-900">
                    {s.label}
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                    {s.code}
                  </p>
                </div>
                <Badge
                  variant={severityVariant(s.severity)}
                  className="w-fit shrink-0 px-2.5 py-1 text-[11px] font-semibold capitalize"
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
