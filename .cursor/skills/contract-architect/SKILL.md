---
name: contract-architect
description: >-
  Designs clean, stable MVP API and UI contracts: input/output shapes, TypeScript
  types, sample JSON, required vs optional fields, validation hints, and extension
  notes. Optimized for one-day builds and card-friendly UIs. Use when defining
  endpoints, request/response schemas, form models, shared types, or before wiring
  frontend to backend; when the user mentions contracts, DTOs, API design, or
  stable JSON shapes for an MVP.
---

# Contract Architect

Design **minimal, stable** contracts for hackathon-style MVPs. Prefer one round-trip, predictable keys, and UI that maps 1:1 to typed fields—no speculative nested graphs.

## When to Apply

- New API route, server action, or Groq/LLM structured output
- Shared types between Next.js client and API
- Refactoring “stringly typed” payloads into explicit shapes

## Principles (in order)

1. **One-day realism**: Smallest surface that demos end-to-end; defer generic plugin systems.
2. **Stable response shapes**: Same top-level keys every time; use `null` or empty arrays instead of omitting keys when the UI expects them.
3. **Clean UI mapping**: One contract field → one card row or chip list item where possible; avoid deep nesting beyond 2 levels for MVP.
4. **Simple architecture**: One request DTO, one response DTO; optional `meta` only if needed for pagination or request IDs.

## Deliverables Checklist

Produce all of the following unless the user opts out:

| # | Deliverable |
|---|-------------|
| 1 | **Input contract** — fields, types, constraints, auth/context assumptions |
| 2 | **Output contract** — success payload; error shape(s) |
| 3 | **UI contract** — which fields drive which components (cards, lists, badges) |
| 4 | **TypeScript interfaces** — `type`/`interface` for input, output, and nested objects |
| 5 | **Sample JSON** — minimal valid request and response (and one error example if applicable) |
| 6 | **Required vs optional** — explicit per field; note defaults |
| 7 | **Frontend validation** — sync rules, what to validate before submit, what to trust from server |
| 8 | **Extension ideas** — additive-only patterns (new optional fields, `version`, feature flags) |

## Output Template

Use this structure in replies (adjust headings if the user wants a shorter answer):

```markdown
## Summary
[One sentence: what boundary this contract defines]

## Input contract
- Purpose:
- Transport: [POST JSON / form / query]
- Fields: [table or list]

## Output contract
- Success:
- Errors: [HTTP + body shape]

## UI contract
| Field | Component | Notes |
|-------|-----------|-------|

## TypeScript

\`\`\`ts
// types here
\`\`\`

## Sample JSON

**Request**
\`\`\`json
\`\`\`

**Response**
\`\`\`json
\`\`\`

## Required vs optional
| Field | Required | Default | Server validation |
|-------|----------|---------|-------------------|

## Frontend validation
- Before submit:
- Display-only / trust server for:

## Future-safe extensions
- [ ] Optional fields only; never repurpose meanings
- [ ] Version or `schemaVersion` if multiple clients
- [ ] ...
```

## Design Rules

### Naming

- Use **consistent casing** (`camelCase` JSON for TS-first stacks unless API already uses `snake_case`).
- **Avoid synonyms** for the same concept (`amount` vs `value`).

### Stability

- Prefer **fixed unions** for MVP (`"approve" | "review" | "block"`) over free strings.
- For lists (e.g. flags), use **`{ code: string; message: string }[]`** or `string[]`—pick one and keep it.
- Include **`meta`** only for: `requestId`, `timestamp`, `durationMs`, or pagination—never business logic in `meta`.

### Errors

- Standardize on **one client-parseable error body**, e.g. `{ error: { code: string; message: string } }` plus optional `details`.
- Reuse the same shape for 4xx/5xx where possible.

### UI Mapping

- **Recommendation / status**: badge or pill.
- **Lists of signals**: scrollable list or stacked chips inside a card.
- **Long text** (explanations): single `Card` body; cap length in contract with `maxLength` if user-generated.

### Frontend Validation (suggestions)

- Validate **format and bounds** client-side (email shape, min/max length, numeric ranges).
- Treat **authorization, fraud, and authoritative risk** as server-side only; show server messages as-is.
- Use the same **Zod/Yup schema** as the single source for form + inferred types when practical.

### Future-Safe Extensions

- Add **new optional fields**; do not change types of existing fields.
- Introduce **`schemaVersion`** (number) when backward compatibility might break.
- Prefer **parallel endpoints** over breaking v1 for large changes.
- Document **deprecation** in comments, not by removing fields during MVP.

## Anti-Patterns for MVP

- Open-ended `Record<string, unknown>` for core domain objects
- Different response shapes for “empty” vs “no data” on the same endpoint
- Nesting deeper than three levels without strong reason
- Encoding multiple concerns in one string (parse in UI)

## Quick Reference: Payment / Risk Context

For this product family, contracts often include: transaction identifiers, amount/currency, merchant/category, geography, velocity hints, account age, dispute history, **signals** (list), **recommendation**, **short explanation**. Keep **signals** and **recommendation** machine-friendly enums where the UI must render consistently.
