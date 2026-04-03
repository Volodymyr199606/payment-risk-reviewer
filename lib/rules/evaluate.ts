import type {
  FlaggedSignal,
  Recommendation,
  RiskLevel,
  TransactionReviewRequest,
  TransactionEcho,
} from "@/types/review";

export const RULES_VERSION = "mvp-1";

export interface RulesOutcome {
  transaction: TransactionEcho;
  riskLevel: RiskLevel;
  flaggedSignals: FlaggedSignal[];
  recommendation: Recommendation;
  confidence: number;
  confidenceNotes: string;
  analystSummary: string;
  rulesVersion: string;
}

function buildTemplateSummary(
  riskLevel: RiskLevel,
  recommendation: Recommendation,
  signals: FlaggedSignal[],
): string {
  const top = signals.slice(0, 3).map((s) => s.label.toLowerCase());
  const signalPhrase =
    top.length > 0 ? ` Key factors: ${top.join("; ")}.` : "";
  return `Rules evaluation: ${riskLevel} risk with ${recommendation} recommendation.${signalPhrase}`;
}

/**
 * Deterministic rules — no I/O. Groq may replace analyst text later; never overrides recommendation here.
 */
export function evaluateTransaction(
  input: TransactionReviewRequest,
): RulesOutcome {
  const transaction: TransactionEcho = {
    transactionId: input.transactionId,
    amount: input.amount,
    currency: input.currency,
    merchantName: input.merchantName,
    merchantCategoryCode: input.merchantCategoryCode,
    cardholderCountry: input.cardholderCountry,
    merchantCountry: input.merchantCountry,
    channel: input.channel,
  };

  const flaggedSignals: FlaggedSignal[] = [];
  let score = 0;

  if (
    input.cardholderCountry !== input.merchantCountry &&
    input.channel === "ecommerce"
  ) {
    flaggedSignals.push({
      code: "GEO_MISMATCH",
      label: "Cardholder and merchant countries differ",
      severity: "warning",
    });
    score += 2;
  }

  if (input.velocity24hCount > 5) {
    flaggedSignals.push({
      code: "HIGH_VELOCITY",
      label: "Elevated transaction count in the last 24 hours",
      severity: input.velocity24hCount > 10 ? "critical" : "warning",
    });
    score += input.velocity24hCount > 10 ? 3 : 2;
  }

  if (input.accountAgeDays < 7) {
    flaggedSignals.push({
      code: "NEW_ACCOUNT",
      label: "Account age below typical trust threshold",
      severity: "warning",
    });
    score += 1;
  }

  if (input.priorDisputeCount > 0) {
    flaggedSignals.push({
      code: "PRIOR_DISPUTE",
      label: "Prior dispute history on file",
      severity: "warning",
    });
    score += 1;
  }

  if (input.amount > 500) {
    flaggedSignals.push({
      code: "HIGH_AMOUNT",
      label: "Transaction amount above elevated review threshold",
      severity: "info",
    });
    score += 1;
  }

  let riskLevel: RiskLevel;
  if (score <= 2) riskLevel = "low";
  else if (score <= 4) riskLevel = "medium";
  else riskLevel = "high";

  let recommendation: Recommendation;
  if (score >= 6 || input.velocity24hCount > 12) {
    recommendation = "block";
  } else if (score >= 3) {
    recommendation = "review";
  } else {
    recommendation = "approve";
  }

  const confidence = Math.min(
    0.95,
    0.55 + score * 0.06 + (flaggedSignals.length > 0 ? 0.05 : 0),
  );

  const confidenceNotes =
    flaggedSignals.length === 0
      ? "No rule-based signals fired; confidence reflects a clean baseline only."
      : "Confidence reflects rule hits and signal overlap; manual review may still be required for policy exceptions.";

  const analystSummary = buildTemplateSummary(
    riskLevel,
    recommendation,
    flaggedSignals,
  );

  return {
    transaction,
    riskLevel,
    flaggedSignals,
    recommendation,
    confidence,
    confidenceNotes,
    analystSummary,
    rulesVersion: RULES_VERSION,
  };
}
