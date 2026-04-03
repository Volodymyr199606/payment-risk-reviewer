import { Card } from "@/components/ui/card";

export function AnalystSummaryCard({ text }: { text: string }) {
  return (
    <Card variant="muted" className="h-full p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        Analyst summary
      </p>
      <div className="mt-4 border-l-[3px] border-sky-400/70 bg-sky-50/30 pl-4 py-1">
        <p className="text-[15px] font-normal leading-[1.75] text-slate-800">
          {text}
        </p>
      </div>
    </Card>
  );
}
