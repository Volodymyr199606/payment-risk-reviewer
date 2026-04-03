import { Card, CardTitle } from "@/components/ui/card";

export function ConfidenceCard({
  confidence,
  notes,
}: {
  confidence: number;
  notes: string;
}) {
  const pct = Math.round(confidence * 100);
  return (
    <Card>
      <CardTitle>Confidence / notes</CardTitle>
      <div className="mt-4 space-y-3">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>Model confidence</span>
            <span className="font-medium text-slate-800">{pct}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-800 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">{notes}</p>
      </div>
    </Card>
  );
}
