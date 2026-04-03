import { Card, CardTitle } from "@/components/ui/card";

export function AnalystSummaryCard({ text }: { text: string }) {
  return (
    <Card>
      <CardTitle>Analyst summary</CardTitle>
      <p className="mt-4 text-sm leading-relaxed text-slate-800">{text}</p>
    </Card>
  );
}
