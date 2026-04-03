import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { evaluateTransaction } from "@/lib/rules/evaluate";
import { generateAnalystSummaryWithGroq } from "@/lib/groq/analyst-summary";
import { persistReview } from "@/lib/supabase/persist-review";
import { transactionReviewRequestSchema } from "@/lib/validation/review-request";
import type { RiskReviewResult, TransactionReviewRequest } from "@/types/review";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body must be JSON",
        },
      },
      { status: 400 },
    );
  }

  const parsed = transactionReviewRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid transaction payload",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const input = parsed.data as TransactionReviewRequest;
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

  const result: RiskReviewResult = {
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
      persistedReviewId: persistedId,
    },
  };

  return NextResponse.json(result);
}
