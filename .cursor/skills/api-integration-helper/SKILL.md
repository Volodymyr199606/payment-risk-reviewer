---
name: api-integration-helper
description: >-
  Connects Next.js frontends to backend Route Handlers with centralized fetch
  wrappers, TypeScript response types, simple async state (loading / empty /
  success / error), and debug-friendly single-module API code. Use when wiring
  client components to `app/api`, refactoring scattered fetch calls, defining
  request/response typing for API calls, or when the user mentions API integration,
  fetch patterns, or keeping the frontend decoupled from backend internals.
---

# API Integration Helper

Ship **clean HTTP boundaries** between the browser and Route Handlers (or a single backend base URL). The frontend knows **URLs + JSON shapes + errors** — nothing about databases, ORMs, or server-only modules.

**Pairs with** [contract-architect](../contract-architect/SKILL.md) (stable JSON types), [frontend-architect](../frontend-architect/SKILL.md) (where `lib/api` lives), [ui-builder](../ui-builder/SKILL.md) (how screens show async states).

## Coupling rules (non-negotiable)

| Do | Do not |
|----|--------|
| Import shared **types** from `types/` (or `lib/api` re-exports) | Import server modules (`db`, `prisma`, route internals) into client code |
| Call **documented HTTP routes** (`/api/...`) via `lib/api` | Duplicate URL strings across feature components |
| Treat the response as **JSON matching a contract** | Assume field names or nesting match DB columns |

**Client components** (`"use client"`) must only use `lib/api` + types + UI — never direct DB or env secrets on the client.

## File layout (minimal)

```text
lib/
  api.ts              # optional: apiClient.ts or api/review.ts if > ~150 lines
types/
  api.ts              # or index.ts — request/response DTOs aligned with Route Handlers
```

One **primary** module for HTTP keeps breakpoints, logging, and error mapping in one place.

## Fetch pattern

Use **native `fetch`** in `lib/api` unless the repo already standardizes on something else.

**Conventions**

- **Base path**: Prefer relative URLs for same-origin Route Handlers: `fetch("/api/review", { ... })` so Vercel previews and local dev work without `NEXT_PUBLIC_API_URL` for the default case.
- **JSON**: `headers: { "Content-Type": "application/json" }` on POST/PUT/PATCH; `body: JSON.stringify(payload)`.
- **Errors**: Read `response.ok`; if false, try `await response.json()` for `{ message?: string }` (or project error shape), then **throw** a small `ApiError` or return `Result` — pick one style and reuse it.
- **Timeouts**: For hackathon MVPs, optional `AbortController` only if UX needs cancel; avoid extra libraries.

**Central wrapper (recommended)**

Implement **one** internal helper, e.g. `requestJson<T>(path, init)`, that:

1. Performs `fetch`
2. Parses JSON on success
3. Maps 4xx/5xx to a typed error the UI can branch on
4. Optionally logs **request id / path / status** in development (`process.env.NODE_ENV === "development"`)

Feature functions stay thin:

```ts
// lib/api.ts — illustrative
export async function postReview(input: ReviewRequest): Promise<ReviewResponse> {
  return requestJson<ReviewResponse>("/api/review", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
```

## TypeScript typing

- **Source of truth**: Types live next to or under `types/` and match what Route Handlers **return** and **accept** (same names as [contract-architect](../contract-architect/SKILL.md) if used).
- **Generics**: `requestJson<T>` is enough for most MVPs; avoid deep mapped types.
- **Narrow errors**: Optional `errorCode` string union on server responses if the UI must show different copy — keep the union small.

## State management for async requests

**Default for hackathon MVP**: `useState` + one discriminated union per screen or per resource.

```ts
type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "empty" }           // optional: valid “no data” after success
  | { status: "success"; data: T }
  | { status: "error"; message: string };
```

- **idle**: Form ready; no request yet.
- **loading**: In-flight; disable primary action.
- **empty**: Success with nothing to show (e.g. empty list) — use only when the product needs it.
- **success**: Render `data`.
- **error**: Show banner/alert; keep form values unless reset is intentional.

**Escalate** to React Query / SWR only when the repo already uses them or caching/refetch is required — not for a single POST demo.

## UI states (what the skill expects downstream)

Map the union to UI as in [ui-builder](../ui-builder/SKILL.md): skeleton (loading), short copy (empty), cards (success), alert + retry (error). The API layer **does not** render UI; it only returns data or throws/returns errors consistently.

## Debugging and observability (lightweight)

- **Single file** (or `lib/api/*` folder): developers open one place to set breakpoints.
- **Dev-only logging**: Log method, path, status — never tokens or full PANs.
- **Stable error shape**: e.g. `{ message: string, code?: string }` from the server so the client does not parse raw stacks.

## Anti-patterns

- Raw `fetch` inside `components/features/*` for the same route called in multiple places.
- Duplicating response interfaces inside every component.
- Leaking Prisma/SQL types into the client “for convenience”.
- Adding axios + interceptors + factory classes for one endpoint.
- Global state stores for a single form submission unless already standard in the repo.

## Manual verification (after wiring)

| Check | Action |
|-------|--------|
| Types | `pnpm exec tsc --noEmit` (or project equivalent) passes |
| Success | Submit valid payload; network tab shows 200 and JSON matches `T` |
| Error | Force 4xx/5xx; UI shows mapped message; no uncaught promise |
| Coupling | Grep `components` for `@/lib/db` or `prisma` — should be **empty** on client |

## Summary

**One module**, **typed JSON**, **one async union**, **HTTP-only coupling** — enough structure to debug and extend without framework churn.
