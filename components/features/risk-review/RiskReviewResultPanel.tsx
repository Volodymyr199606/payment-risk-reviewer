import type { RiskReviewResult } from "@/types/review";
import { TransactionSummaryCard } from "@/components/features/risk-review/TransactionSummaryCard";
import { ReviewOutcomeSection } from "@/components/features/risk-review/ReviewOutcomeSection";
import { FlaggedSignalsCard } from "@/components/features/risk-review/FlaggedSignalsCard";
import { AnalystSummaryCard } from "@/components/features/risk-review/AnalystSummaryCard";
import { ConfidenceCard } from "@/components/features/risk-review/ConfidenceCard";
export function RiskReviewResultPanel({ result }: { result: RiskReviewResult }) {
  const { meta } = result;
  return (
    <div className="space-y-10">
      <ReviewOutcomeSection
        recommendation={result.recommendation}
        riskLevel={result.riskLevel}
      />

      <FlaggedSignalsCard signals={result.flaggedSignals} />

      <TransactionSummaryCard transaction={result.transaction} />

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 lg:gap-8 lg:items-start">
        <AnalystSummaryCard text={result.analystSummary} />
        <ConfidenceCard
          confidence={result.confidence}
          notes={result.confidenceNotes}
        />
      </div>

      <footer className="border-t border-slate-200/80 pt-6 text-center text-[11px] leading-relaxed text-slate-400">
        <span className="font-mono text-slate-500">
          {meta.requestId.slice(0, 8)}…
        </span>
        {" · "}
        {new Date(meta.evaluatedAt).toLocaleString()}
        {meta.explanationSource ? ` · ${meta.explanationSource}` : ""}
        {meta.groqModel ? ` · ${meta.groqModel}` : ""}
        {meta.persistedReviewId
          ? ` · saved ${meta.persistedReviewId.slice(0, 8)}…`
          : ""}
      </footer>
    </div>
  );
}
