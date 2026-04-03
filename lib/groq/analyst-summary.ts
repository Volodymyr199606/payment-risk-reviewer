import Groq from "groq-sdk";
import type { RulesOutcome } from "@/lib/rules/evaluate";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

export function isGroqEnabled(): boolean {
  return (
    Boolean(process.env.GROQ_API_KEY) &&
    process.env.ENABLE_GROQ_EXPLANATION !== "false"
  );
}

/**
 * Optional narrative layer — must not change recommendation/risk enums from rules.
 * Falls back to caller's template summary on any failure.
 */
export async function generateAnalystSummaryWithGroq(
  outcome: RulesOutcome,
): Promise<{ text: string; model: string } | null> {
  if (!isGroqEnabled()) return null;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL ?? DEFAULT_MODEL;
  const client = new Groq({ apiKey });

  const system = `You are a payment risk analyst assistant. Write a concise 2-4 sentence summary for an analyst.
Rules:
- Do NOT contradict the given risk level or recommendation.
- Reference only the structured signals provided.
- Professional, neutral tone. No markdown.`;

  const user = JSON.stringify({
    riskLevel: outcome.riskLevel,
    recommendation: outcome.recommendation,
    flaggedSignals: outcome.flaggedSignals,
    confidence: outcome.confidence,
  });

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
      max_tokens: 320,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
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
