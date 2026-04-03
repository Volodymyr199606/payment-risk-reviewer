/**
 * Shared API contracts for risk review — aligned with POST /api/review.
 */

export type PaymentChannel = "ecommerce" | "pos" | "unknown";

export interface TransactionReviewRequest {
  transactionId: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategoryCode: string;
  cardholderCountry: string;
  merchantCountry: string;
  channel: PaymentChannel;
  accountAgeDays: number;
  priorDisputeCount: number;
  velocity24hCount: number;
  notes?: string;
}

export type RiskLevel = "low" | "medium" | "high";
export type Recommendation = "approve" | "review" | "block";
export type SignalSeverity = "info" | "warning" | "critical";

export interface FlaggedSignal {
  code: string;
  label: string;
  severity: SignalSeverity;
}

export interface TransactionEcho {
  transactionId: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategoryCode: string;
  cardholderCountry: string;
  merchantCountry: string;
  channel: PaymentChannel;
}

export interface RiskReviewResult {
  schemaVersion: number;
  transaction: TransactionEcho;
  riskLevel: RiskLevel;
  flaggedSignals: FlaggedSignal[];
  recommendation: Recommendation;
  analystSummary: string;
  confidence: number;
  confidenceNotes: string;
  meta: {
    requestId: string;
    evaluatedAt: string;
    rulesVersion?: string;
    explanationSource?: "rules" | "groq";
    persistedReviewId?: string;
  };
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
