---
name: frontend-architect
description: >-
  Designs hackathon-ready frontend architecture: folder layout, page shell,
  component boundaries, state flow, API touchpoints, TypeScript types, async UI
  states, and responsive patterns. Optimized for Next.js MVPs, speed, and demo
  quality. Use when scaffolding or refactoring UI, planning pages and components,
  wiring client to API, or when the user mentions frontend structure, layout,
  state management, or implementation order for an MVP.
---

# Frontend Architect

Design a **small, shippable** frontend for one-day MVPs. Prefer boring patterns, one happy path, and UI that survives a live demo (loading, empty, error).

**Pairs with** [contract-architect](../contract-architect/SKILL.md): define API/types first, then map UI to contracts.

## Principles (in order)

1. **Demo first**: One primary user journey works end-to-end before polish.
2. **Flat folders**: Few layers; colocate what changes together.
3. **Stable boundaries**: `lib/api`, `types`, `components` — not a deep tree of abstractions.
4. **Explicit async states**: Every data surface handles loading / empty / success / error.

## Default stack assumptions

- **Next.js App Router**, TypeScript, **pnpm**
- Server Components where possible; `"use client"` only for interactivity
- API via **Route Handlers** or **Server Actions**; client fetches through thin `lib/api` helpers

Adjust naming if the project uses Pages Router or a different data layer.

---

## 1. Folder structure (hackathon baseline)

Use this as a template; delete unused folders rather than inventing new top-level concepts.

```text
app/
  layout.tsx                 # root shell: fonts, metadata, providers (minimal)
  page.tsx                   # landing or main flow entry
  (routes)/...               # optional route groups
  api/                       # Route Handlers OR omit if 100% Server Actions
components/
  ui/                        # primitives: Button, Card, Input, Skeleton (shadcn-style or hand-rolled)
  layout/                    # AppShell, PageHeader, Sidebar (only if needed)
  features/<feature>/        # domain: ReviewForm, RiskResultCard, SignalList
lib/
  api.ts                     # fetch wrappers, base URL, error mapping
  utils.ts                   # cn(), formatters
types/
  index.ts                   # re-exports; or split api.ts types per domain file
public/
```

**Rules**

- **`components/ui`**: reusable, mostly stateless; no domain imports from `features`.
- **`components/features/*`**: product language; may import `ui` and `lib`.
- **`types`**: shared DTOs aligned with backend; avoid duplicating shapes in random files.
- **No** `services/repositories/usecases` unless the repo already uses them.

---

## 2. Page layout

**Root `layout.tsx`**

- Global font and CSS variables
- Optional single provider (e.g. React Query) only if used — skip for minimal MVP
- Skip heavy chrome (sidebars) unless the demo needs navigation between many pages

**Feature page pattern**

- **`PageHeader`**: title + one-line subtitle (optional)
- **Primary column**: form → result (vertical stack on mobile)
- **Max width**: `max-w-3xl` or `max-w-4xl` centered with horizontal padding for “SaaS” feel

**Regions**

| Region        | Purpose                                      |
|---------------|----------------------------------------------|
| Header        | Product name, optional env badge             |
| Main          | Single primary task (review transaction)     |
| Footer        | Optional links; omit for hackathon           |

Use **one** consistent page wrapper component (e.g. `PageShell`) if more than two pages exist.

---

## 3. Component structure

Split by **role**, not by file count.

| Layer        | Contains                                      | Imports from                          |
|--------------|-----------------------------------------------|---------------------------------------|
| `ui/*`       | Button, Card, Badge, Input, Skeleton, Alert     | React, styling utils only             |
| `features/*` | Forms, result panels, lists bound to domain    | `ui`, `lib`, `types`                  |
| `layout/*`   | App shell, nav                                | `ui`                                  |

**Naming**

- **Containers** (smart): `*Section`, `*Panel`, `*Form` — own local state and callbacks.
- **Presentational** (dumb): `*Card`, `*Row`, `*List` — props in, markup out.

**Card-first UI**

- One card per major concept (e.g. transaction summary, signals, recommendation).
- Lists: map to small row components; avoid 200-line JSX blocks in `page.tsx`.

---

## 4. State flow

**Default MVP**

- **Server state**: fetched in Server Component and passed as props **or** loaded in client via one `useEffect` + `useState` for speed.
- **Form state**: `useState` or React Hook Form if validation is non-trivial.
- **URL state**: use `searchParams` only when shareable links matter for the demo.

**Avoid for MVP**

- Global client stores (Zustand/Redux) unless multiple distant components must share state.
- Optimistic updates unless the demo script requires them.

**Data flow diagram (mental model)**

```text
User input → validate (client, light) → API (server) → typed response → UI state → cards
```

**Error flow**

- Parse API error body once in `lib/api` → return `{ ok: false, error }` or throw normalized `ApiError`.
- UI shows **one** inline alert or toast + preserve form values.

---

## 5. API integration points

| Location        | Responsibility                                                |
|-----------------|---------------------------------------------------------------|
| `lib/api.ts`    | `baseUrl`, `fetch` with JSON, timeout optional, error mapping |
| Route Handlers  | `app/api/.../route.ts` — validate body, call DB/LLM, return DTO |
| Server Actions  | Alternative: `actions.ts` with `"use server"` for mutations   |
| `types`         | Request/response types matching contract-architect output     |

**Client call shape (conceptual)**

- Single function per operation: `submitReview(input: ReviewInput): Promise<ReviewResult>`.
- Map HTTP errors to a **small** union: `network | validation | server | unknown`.

**Security**

- No secrets in client bundles; Groq keys stay server-side.

---

## 6. TypeScript types needed

Minimum set for a risk-review style MVP:

| Type / file        | Purpose                                      |
|--------------------|----------------------------------------------|
| `ReviewInput`      | Form payload / API request body              |
| `ReviewResult`     | API success: recommendation, signals, explanation |
| `RiskSignal`       | Single flag: code, severity, message (as per contract) |
| `ApiErrorBody`     | `{ error: { code: string; message: string } }` |
| `AsyncState<T>`    | Discriminated union for UI (see below)       |

**AsyncState pattern (discriminated union)**

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "empty" }           // optional: valid empty business result
  | { status: "error"; message: string };
```

Use **one** pattern consistently: either `AsyncState` everywhere or separate booleans only in the smallest screen — not both.

**Inference**

- Prefer `z.infer<typeof Schema>` if using Zod for forms; duplicate types only at API boundary if unavoidable.

---

## 7. Loading, empty, success, error

Every screen that depends on async data should implement:

| State    | UI pattern                                                   |
|----------|--------------------------------------------------------------|
| Loading  | Skeleton in card shape; disable primary actions              |
| Empty    | Short message + optional CTA (“Enter a transaction to start”) |
| Success  | Full card content; clear hierarchy                           |
| Error    | Alert/banner + retry; do not wipe unrelated form fields      |

**Rules**

- **Loading**: match layout of success (skeleton ≈ final card layout).
- **Empty**: distinguish “no data yet” (idle) from “server returned no rows” if both exist.
- **Error**: show **actionable** text; log technical detail to console in dev only.

---

## 8. Responsive layout guidance

- **Mobile-first**: single column; tap targets ≥ 44px; no hover-only affordances.
- **Breakpoints**: stack form and results vertically `< md`; optional two-column `md+` only if it improves the demo.
- **Typography**: clear hierarchy (one `h1` per view, section titles `h2` or styled div).
- **Spacing**: generous padding (`p-4`–`p-8`); avoid edge-to-edge text on large phones.
- **Tables**: on small screens, prefer **cards per row** over horizontal scroll unless the table is tiny.

---

## 9. Best implementation order

Execute in this order to maximize working demo time:

1. **Types + API contract** — align with backend (contract-architect).
2. **Static page shell** — layout, header, placeholder cards (no data).
3. **`lib/api` stub** — return mock JSON matching types (optional but fast for UI).
4. **Feature components** — form + result cards wired to mock or real API.
5. **Async states** — loading skeletons, error alert, empty state copy.
6. **Wire real API** — swap mock; fix edge cases.
7. **Responsive pass** — one pass at `sm` and `md` widths.
8. **Demo polish** — default form values, sample transaction, loading delay only if needed.

**Stop early** if time is low: a **working path with good error handling** beats extra pages.

---

## Deliverables checklist

When “architecting,” produce a concise answer that covers:

| # | Topic |
|---|--------|
| 1 | Folder tree (as applied to this repo) |
| 2 | Page layout — regions and main wrapper |
| 3 | Component list — ui vs features, main files |
| 4 | State flow — where data lives and updates |
| 5 | API touchpoints — files and function names |
| 6 | Types — key interfaces/unions |
| 7 | Async UI — how each state renders |
| 8 | Responsive — breakpoints and stacking rules |
| 9 | Implementation order — numbered steps |

---

## Anti-patterns (MVP)

- More than one global state library “just in case”
- Fetch calls scattered across components instead of `lib/api`
- Different loading UI on every screen with no shared skeleton primitives
- Deep component folders (`components/foo/bar/baz/widgets`) without payoff
- Omitting error UI because “the demo uses happy path only”

## Quick reference: Payment Risk Reviewer

Prioritize **one flow**: submit transaction context → show **recommendation**, **signals**, **short explanation** in **cards**. Keep navigation minimal; full-width readable content beats dense dashboards for judges.
