---
name: demo-polisher
description: >-
  Audits an existing MVP for demo readiness: user flow clarity, visible value,
  visual polish, information scanability, first impression, and what to cut or
  simplify. Produces a prioritized list of practical, quick-win improvements only.
  Use when polishing for a demo, hackathon presentation, stakeholder walkthrough,
  or when the user asks for demo readiness, first impression, or what to remove
  before showing the product.
---

# Demo Polisher

Use this skill when the **current** app needs to **look and feel demo-ready** without scope creep. Optimize for **speed of improvement** and **what a stranger sees in the first 60 seconds**.

## When to apply

- User mentions: demo, pitch, judges, stakeholders, recording a walkthrough, “ship today”
- Goal is **improvement of what exists**, not new features unless they unblock the demo

## What to ignore

- Long-term architecture debates
- Theoretical “nice to have” lists
- Changes that need days of work unless they are the single highest-leverage fix

## Analysis dimensions (cover each briefly)

Work **from the codebase and UI** (routes, main page, primary flow). If the repo is unclear, state assumptions explicitly.

| Dimension | Questions |
|-----------|-----------|
| **User flow** | Is there one obvious path? Where does the user hesitate or backtrack? |
| **Visible value** | Within 10–20 seconds, is it obvious *what problem this solves* and *what the output is*? |
| **Visual polish** | Spacing, hierarchy, alignment, empty/loading/error states, mobile width — anything that reads “unfinished”? |
| **Scanability** | Can someone skim cards/sections and get the story without reading every line? |
| **First impression** | Above-the-fold: headline, primary CTA, sample or placeholder that shows the happy path. |
| **Cut / simplify** | What distracts, duplicates, or adds cognitive load without helping the demo? |

## Output format (required)

Return **practical improvements only**, in this structure:

```markdown
## Demo polish — [product or page name]

### First 60 seconds (highest priority)
- [ ] …

### Quick wins (≤ ~1–2 hours total, ordered)
1. …
2. …

### Flow & copy
- …

### Visual & layout
- …

### Remove or defer
- …

### Optional (only if time remains)
- …
```

**Rules for items**

- Each bullet is **one actionable change** (what to change + where), not a lecture.
- **Quick wins** must be things that noticeably improve the demo **without** large refactors.
- **Remove or defer** is mandatory: name at least one thing to cut, hide behind a toggle, or postpone.
- Use **`[ ]` checkboxes** only in the “First 60 seconds” and “Quick wins” sections so the user can track execution.

## Prioritization

1. **First impression + primary path** — landing, hero, CTA, default data or seed example
2. **Loading / error / empty** on the main action — avoids awkward silence during demo
3. **Typography and spacing** — cheap lift, high perceived quality
4. **Trim noise** — secondary nav, unused fields, debug UI, redundant explanations
5. Everything else

## Execution guidance (if the user wants implementation)

- Prefer the smallest diff that improves the demo; pair with [ui-builder](../ui-builder/SKILL.md) for UI work.
- After changes, give **3–5 manual test steps** that match the demo script (open → act → see result).

## Anti-patterns

- Do not recommend a “rewrite” unless the app is unusable — suggest targeted fixes first.
- Do not inflate the list with generic best practices unrelated to this MVP.
- Do not skip **Remove or defer** — demos improve as much from subtraction as from addition.
