/**
 * PRR Reviewer Agent — single orchestrator for one review.
 * Identity & rules: docs/REVIEWER_AGENT.md
 *
 * Order: rules tool (deterministic) → Groq narrative → Supabase persist.
 * Risk level, signals, and recommendation always come from the rules engine only.
 */

import { randomUUID } from "crypto";
import { evaluateTransaction } from "@/lib/rules/evaluate";
import { generateAnalystSummaryWithGroq } from "@/lib/groq/analyst-summary";
import { persistReview } from "@/lib/supabase/persist-review";
import type { RiskReviewResult, TransactionReviewRequest } from "@/types/review";

export async function runReviewerAgent(
  input: TransactionReviewRequest,
): Promise<RiskReviewResult> {
  const outcome = evaluateTransaction(input);

  let analystSummary = outcome.analystSummary;
  let explanationSource: "rules" | "groq" = "rules";
  let groqModel: string | null = null;

  const groq = await generateAnalystSummaryWithGroq(outcome);
  if (groq) {
    analystSummary = groq.text;
    explanationSource = "groq";
    groqModel = groq.model;
  }

  const persistedId = await persistReview({
    request: input,
    outcome,
    analystSummary,
    groqModel,
  });

  return {
    schemaVersion: 1,
    transaction: outcome.transaction,
    riskLevel: outcome.riskLevel,
    flaggedSignals: outcome.flaggedSignals,
    recommendation: outcome.recommendation,
    analystSummary,
    confidence: outcome.confidence,
    confidenceNotes: outcome.confidenceNotes,
    meta: {
      requestId: randomUUID(),
      evaluatedAt: new Date().toISOString(),
      rulesVersion: outcome.rulesVersion,
      explanationSource,
      ...(groqModel ? { groqModel } : {}),
      persistedReviewId: persistedId,
    },
  };
}
