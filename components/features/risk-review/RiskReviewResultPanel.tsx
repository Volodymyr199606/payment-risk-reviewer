import type { RiskReviewResult } from "@/types/review";
import { TransactionSummaryCard } from "@/components/features/risk-review/TransactionSummaryCard";
import { RiskLevelCard } from "@/components/features/risk-review/RiskLevelCard";
import { FlaggedSignalsCard } from "@/components/features/risk-review/FlaggedSignalsCard";
import { RecommendationCard } from "@/components/features/risk-review/RecommendationCard";
import { AnalystSummaryCard } from "@/components/features/risk-review/AnalystSummaryCard";
import { ConfidenceCard } from "@/components/features/risk-review/ConfidenceCard";

export function RiskReviewResultPanel({ result }: { result: RiskReviewResult }) {
  const { meta } = result;
  return (
    <div className="space-y-4">
      <TransactionSummaryCard transaction={result.transaction} />
      <RiskLevelCard riskLevel={result.riskLevel} />
      <FlaggedSignalsCard signals={result.flaggedSignals} />
      <RecommendationCard recommendation={result.recommendation} />
      <AnalystSummaryCard text={result.analystSummary} />
      <ConfidenceCard
        confidence={result.confidence}
        notes={result.confidenceNotes}
      />
      <p className="text-center text-xs text-slate-400">
        Request {meta.requestId.slice(0, 8)}… ·{" "}
        {new Date(meta.evaluatedAt).toLocaleString()}
        {meta.explanationSource ? ` · ${meta.explanationSource}` : ""}
        {meta.persistedReviewId
          ? ` · saved ${meta.persistedReviewId.slice(0, 8)}…`
          : ""}
      </p>
    </div>
  );
}
