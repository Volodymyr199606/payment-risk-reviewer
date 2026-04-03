import Groq from "groq-sdk";
import type { RulesOutcome } from "@/lib/rules/evaluate";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function isGroqEnabled(): boolean {
  return (
    Boolean(process.env.GROQ_API_KEY?.trim()) &&
    process.env.ENABLE_GROQ_EXPLANATION !== "false"
  );
}

/**
 * Optional narrative layer only. Rules engine outcome is frozen: this function
 * must not change risk level, signals, or recommendation (those are not sent back
 * to the client from here — only `analystSummary` text is substituted).
 * Returns null on any failure → API uses template `outcome.analystSummary`.
 */
export async function generateAnalystSummaryWithGroq(
  outcome: RulesOutcome,
): Promise<{ text: string; model: string } | null> {
  if (!isGroqEnabled()) return null;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey?.trim()) return null;

  const model = process.env.GROQ_MODEL?.trim() || DEFAULT_MODEL;
  const client = new Groq({ apiKey });

  const system = `You are a senior payment risk analyst writing a short case note for internal review.

Hard constraints (must follow):
- The risk assessment is already decided by a rules engine. You are ONLY writing prose.
- You MUST NOT change, contradict, or re-interpret: risk level, recommendation, or any flagged signals.
- Do NOT invent new risk factors, merchants, amounts, or signals that are not in the JSON.
- Do NOT suggest a different recommendation or risk tier than provided.
- Write 2–4 sentences. Professional, neutral, plain text. No markdown, no bullet lists, no headings.`;

  const userPayload = {
    rulesVersion: outcome.rulesVersion,
    frozenOutcome: {
      riskLevel: outcome.riskLevel,
      recommendation: outcome.recommendation,
      flaggedSignals: outcome.flaggedSignals,
      confidence: outcome.confidence,
    },
    contextForNarrativeOnly: {
      transactionId: outcome.transaction.transactionId,
      amount: outcome.transaction.amount,
      currency: outcome.transaction.currency,
      merchantName: outcome.transaction.merchantName,
      channel: outcome.transaction.channel,
    },
  };

  const user = JSON.stringify(userPayload, null, 0);

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.25,
      max_tokens: 380,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Explain the assessment for an analyst. Use the frozen outcome exactly as authoritative. Data:\n${user}`,
        },
      ],
    });
    const text = completion.choices[0]?.message?.content?.trim();
    if (!text) return null;
    return { text, model };
  } catch (e) {
    console.error("[groq] analyst summary failed:", e);
    return null;
  }
}
