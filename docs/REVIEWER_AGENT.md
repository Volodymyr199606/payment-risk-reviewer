# Reviewer Agent — architecture (hackathon MVP)

Single **Reviewer Agent** powered by **Groq**. The **deterministic rules engine** remains the source of truth for risk level, flagged signals, and recommendation. The agent orchestrates the flow, calls tools, and produces analyst-facing language within a **stable JSON contract** unchanged for the frontend.

---

## 1. Agent identity

| Field | Definition |
|--------|------------|
| **Name** | **PRR Reviewer** (Payment Risk Reviewer Reviewer) |
| **Purpose** | Turn validated transaction context into a **consistent, explainable risk review** for analysts: deterministic decision first, then clear narrative and structured output for the UI. |
| **Identity (one paragraph)** | PRR Reviewer is a specialist assistant that **never decides risk alone**. It always grounds its work in the **rules evaluation tool**, treats that output as **authoritative** for risk level, signals, and recommendation, and uses Groq only to **orchestrate**, **word** explanations, and **assemble** the same API response the product already expects. It stays factual, concise, and aligned with payment-risk operations—no invented merchants, amounts, or policy overrides. |

---

## 2. Agent rules

1. **Rules first** — Always obtain a full rules evaluation **before** any narrative or final JSON assembly that depends on risk, signals, or recommendation.
2. **No override** — Never change `riskLevel`, `flaggedSignals`, or `recommendation` from the rules tool. Never instruct the user to act against those values.
3. **Concise analyst voice** — Explanations are short, neutral, and suitable for internal review (no hype, no markdown in payload fields unless the contract allows).
4. **Stable contract** — Response shape matches `RiskReviewResult` / existing UI: same fields, same types; only **wording** inside allowed string fields may come from the model within constraints.
5. **Fallback** — If Groq fails (timeout, rate limit, empty response), use **template** analyst summary and rule-generated confidence notes; still return **200** with full structured body. If Supabase fails, omit persistence id; response remains valid.
6. **No hallucinated facts** — Do not invent transaction fields, merchants, or signals. Narrative may only interpret **inputs + rule outputs** already present in context.

---

## 3. Agent skills (minimal)

| Skill | MVP use |
|--------|---------|
| **Transaction risk review** | Drive end-to-end review from validated input to final payload. |
| **Signal interpretation** | Explain what flagged signals mean **in plain language**, without adding new signals. |
| **Analyst summary generation** | Produce `analystSummary` text consistent with frozen rule outcomes. |
| **Recommendation explanation** | Clarify **why** the recommendation follows from rules (without changing it). |
| **Structured JSON output** | Emit or fill the **same** server-side DTO the UI already consumes. |

---

## 4. Agent tools (MVP)

### Tool 1 — Rules evaluation

| | |
|--|--|
| **Input** | Transaction context (same as `POST /api/review` body after validation). |
| **Output** | `riskLevel`, `flaggedSignals`, `recommendation`, `confidence`, `confidenceNotes` (and template `analystSummary`), `rulesVersion`, `transaction` echo — **deterministic** from `lib/rules/evaluate`. |
| **Implementation** | TypeScript `evaluateTransaction()` (current rules engine). |

### Tool 2 — Supabase persistence

| | |
|--|--|
| **Input** | Final review payload: request snapshot, rule outcome, final `analystSummary`, optional Groq model id. |
| **Output** | Persisted review `id` or no-op if env missing / error. |
| **Implementation** | `persistReview()` (existing). |

### Optional / future (not required for MVP)

- Fetch prior reviews for the same merchant (context enrichment).
- External sanctions / list checks (new tool, new contracts).

---

## 5. Updated system architecture

| Component | Role |
|-----------|------|
| **Frontend** | Unchanged: form → `POST /api/review` → render cards from JSON. |
| **API route** | Validate input; invoke **Reviewer Agent** (orchestrator module); return stable JSON. |
| **Reviewer agent** | Single Groq-driven orchestrator: calls **rules tool** first, then generates explanation / wording, calls **Supabase tool**, assembles response. |
| **Rules tool** | Deterministic evaluation — **source of truth** for risk, signals, recommendation, numeric confidence. |
| **Supabase tool** | Optional persistence of the final payload. |
| **Stable JSON response** | Same `RiskReviewResult` shape as today. |

---

## 6. End-to-end flow

1. User submits transaction input in the UI.
2. API validates the body (e.g. Zod); invalid → 400.
3. **Reviewer agent** is invoked with validated input.
4. Agent calls **rules evaluation tool** → structured deterministic outcome.
5. Agent uses Groq to produce **analyst summary** (and optionally refine **wording** of confidence notes **only** within bounds—see implementation policy: safest MVP keeps confidence numbers from rules).
6. Agent calls **Supabase persistence tool** with the final payload.
7. API returns **200** + **same JSON contract** as today (`riskLevel`, `flaggedSignals`, `recommendation`, `analystSummary`, `confidence`, `confidenceNotes`, `meta`, etc.).

*Current code path:* rules run first in the route, then Groq fills narrative, then persist—behavior matches this flow; refactoring wraps these steps inside a named `reviewerAgent` module for clarity and demos.

---

## 7. Stable output contract

The UI continues to consume **`RiskReviewResult`** (`types/review.ts`):

- **Transaction summary** — from `transaction` (echo of context).
- **Risk level** — from rules only.
- **Flagged signals** — from rules only.
- **Recommended action** — from rules only.
- **Analyst summary** — Groq-generated or template fallback; **never** changes enums above.
- **Confidence / notes** — Numbers from rules in MVP; agent may adjust **phrasing** of notes only if explicitly implemented without changing numeric `confidence` unless product allows.

**Frontend unchanged** because the API route remains the single integration point and the response shape is fixed; only server-side module boundaries and naming move toward “agent + tools.”

---

## 8. README wording

See root **[README.md](../README.md)** — Groq is described as the **active Reviewer Agent layer**, with deterministic rules as the **decision backbone**.

---

## 9. Diagram-ready architecture

Included in **[README.md](../README.md)** (Mermaid): agent-based flow + agent/tools interaction.

**One-line README summary:** *The PRR Reviewer Agent (Groq) orchestrates each review: it always runs the deterministic rules engine first, then writes the analyst-facing narrative and assembles the same JSON the UI already expects; Supabase stores the record when configured.*

---

## 10. Implementation plan (safe order)

1. ~~**Add `lib/agent/reviewer-agent.ts`**~~ — **Done:** `runReviewerAgent()` encapsulates `evaluateTransaction` → `generateAnalystSummaryWithGroq` → `persistReview` → `RiskReviewResult`. `POST /api/review` validates input only, then calls the agent.
2. **Keep rules and types untouched** in behavior; contract unchanged.
3. **Document agent identity + rules** — module header + this doc.
4. **Optional:** rename `lib/groq/analyst-summary.ts` under `lib/agent/` for cosmetic consistency only.
5. **README + `.env.example`** — Groq framed as Reviewer Agent runtime; `ENABLE_GROQ_EXPLANATION=false` documented for template-only demos.
6. **No multi-agent**, **no new public routes**, **no contract break**.

This order ships a **clear story** (“one agent, two tools”) without risky refactors.
