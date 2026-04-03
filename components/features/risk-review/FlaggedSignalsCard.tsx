import type { FlaggedSignal } from "@/types/review";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Card>
      <CardTitle>Flagged signals</CardTitle>
      {signals.length === 0 ? (
        <p className="mt-4 text-sm text-slate-600">
          No rule-based signals fired for this transaction.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {signals.map((s) => (
            <li
              key={s.code}
              className="flex flex-col gap-1 rounded-lg border border-slate-100 bg-slate-50/50 px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">{s.label}</p>
                <p className="text-xs text-slate-500">{s.code}</p>
              </div>
              <Badge variant={severityVariant(s.severity)} className="shrink-0 capitalize">
                {s.severity}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
