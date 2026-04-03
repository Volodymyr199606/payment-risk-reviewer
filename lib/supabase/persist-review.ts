import type { TransactionReviewRequest } from "@/types/review";
import type { RulesOutcome } from "@/lib/rules/evaluate";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export interface PersistReviewInput {
  request: TransactionReviewRequest;
  outcome: RulesOutcome;
  analystSummary: string;
  groqModel: string | null;
}

/**
 * Writes one row to `reviews` when Supabase is configured.
 * Table shape matches README — run the SQL in Supabase before enabling persist.
 */
export async function persistReview(
  row: PersistReviewInput,
): Promise<string | undefined> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      input: row.request,
      risk_level: row.outcome.riskLevel,
      recommendation: row.outcome.recommendation,
      signals: row.outcome.flaggedSignals,
      rules_version: row.outcome.rulesVersion,
      explanation: row.analystSummary,
      model: row.groqModel,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[supabase] persistReview error:", error.message);
    return undefined;
  }

  return data?.id as string | undefined;
}
