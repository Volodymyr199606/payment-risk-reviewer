import { Card } from "@/components/ui/card";

export function AnalystSummaryCard({ text }: { text: string }) {
  return (
    <Card variant="muted" className="h-full p-5 sm:p-6">
      <p className="text-xs font-semibold text-slate-700">Analyst summary</p>
      <p className="mt-3 text-sm leading-[1.65] text-slate-700">{text}</p>
    </Card>
  );
}
