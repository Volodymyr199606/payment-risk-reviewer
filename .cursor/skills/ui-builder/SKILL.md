---
name: ui-builder
description: >-
  Builds Next.js + TypeScript UIs with modular components, clear layout hierarchy,
  card-based results, polished spacing and typography, async states (loading, empty,
  success, error), responsive behavior, and thin API integration. Use when implementing
  or polishing screens, building feature UI from scratch, wiring components to backend
  routes, or when the user asks for clean minimal UI, demo-ready pages, or step-by-step
  UI construction with manual test steps.
---

# UI Builder

Execute **hackathon-ready** frontend work: ship fast, look polished, one primary flow that demos well.

**Pairs with** [frontend-architect](../frontend-architect/SKILL.md) for folder layout and state patterns; [contract-architect](../contract-architect/SKILL.md) for API shapes. This skill focuses on **how to build**: structure first, then files in order, then how to verify each step manually.

## Stack (fixed unless the repo differs)

- **Next.js** (App Router), **TypeScript**, **pnpm**
- Server Components by default; `"use client"` only where needed (forms, browser APIs, local UI state)
- Backend: Route Handlers (`app/api/.../route.ts`) or Server Actions — client calls through **`lib/api`**

## Visual direction

- **Clean, minimal, enterprise SaaS**: generous whitespace, rounded cards, subtle borders/shadows
- **No** flashy gradients or visual noise
- **Typography**: limited scale (e.g. one page title, clear section labels, readable body)
- **Spacing**: consistent scale (e.g. `gap-4` / `gap-6`, section padding `p-6`–`p-8`)

## Mandatory workflow (always follow this order)

### 1. Component structure first (before any code)

Output a **tree or bullet hierarchy** that shows:

- **Pages / routes** — which `page.tsx` (or segment) owns the flow
- **`components/ui`** — primitives reused everywhere (Button, Card, Input, Skeleton, Alert)
- **`components/features/<feature>`** — domain sections (e.g. form, result stack, signal list)
- **`lib/api`** — function(s) that call the backend; no raw `fetch` in feature components if avoidable
- **`types`** — request/response types aligned with the API

Keep the tree **shallow** — no deep nesting of folders without reason.

### 2. Implement file by file

Suggested order (skip steps already done):

1. **Types** — minimal DTOs for the screen
2. **`lib/api`** — one function per operation; map errors to a small union or `ApiError`
3. **`components/ui`** — only what this screen needs first; expand later
4. **Feature components** — presentational cards first, then container that wires state + API
5. **`page.tsx`** — compose layout: header region → main column → cards
6. **Async states** — loading skeletons, empty copy, error banner, success cards

**Rules**

- **Card-based results**: one card per major idea (summary, signals, recommendation, explanation)
- **Layout hierarchy**: single primary column on mobile; optional two columns on `md+` only if it helps the demo
- **Responsive**: mobile-first; tap targets adequate; no hover-only critical actions

### 3. Manual test steps after each meaningful step

After each chunk of work, add **short manual verification** the user (or you) can run:

| After completing | Manual check |
|------------------|--------------|
| Types + API stub | `pnpm dev`, open page; confirm no type errors; optional network tab for mocked call |
| UI primitives | Story or page: buttons/inputs render; focus states work |
| Feature cards (static) | Fill props with mock data; layout matches skeleton spacing |
| Loading | Trigger slow response or temporary delay; skeleton matches card layout |
| Empty | Submit empty / reset; message + optional CTA visible |
| Error | Force 4xx/5xx or invalid body; inline alert + form values preserved |
| Success | Full card stack; typography hierarchy readable |
| Responsive | Resize to ~375px and ~1024px; no horizontal overflow; cards stack |

Use **plain steps**: “Open `/`, click Submit, expect …” — no automated test framework required for MVP unless the repo already uses one.

## Async states (required on every data-dependent surface)

| State | UI |
|-------|-----|
| **Loading** | Skeletons that mirror final card layout; disable primary action |
| **Empty** | Short message (“No review yet” / “Enter details to run analysis”) |
| **Success** | Full card content; clear visual priority (recommendation before secondary detail) |
| **Error** | Single alert or banner; **actionable** copy; retry when sensible; do not clear unrelated inputs |

Prefer one discriminated union (e.g. `AsyncState<T>`) or equivalent — see frontend-architect.

## Backend integration

- **Single place** for HTTP: `lib/api.ts` (or `lib/api/<feature>.ts` if split)
- **Route Handlers** return JSON matching shared **types**; validate input on the server
- Client components call `lib/api` only — keeps components testable and swaps easy for demos (mock → real)

## What to deliver in one response (typical)

1. **Component structure** (tree) — **first**
2. **Files to add/change** — ordered list
3. **Implementation** — file by file or grouped by file
4. **Manual test steps** — per step or per milestone

## Anti-patterns

- Implementing `page.tsx` before listing components and ownership
- Different loading UI on every screen with no shared Skeleton
- Raw `fetch` scattered across feature components
- Skipping empty/error because “demo is happy path”
- Over-abstracting (HOCs, deep provider trees) for a one-day MVP

## Quick reference: Payment Risk Reviewer

One flow: **input → review → cards** (risk level, signals, recommendation, short explanation). Keep navigation minimal; prioritize readability and a convincing loading → success transition for judges.
