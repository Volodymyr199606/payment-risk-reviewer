# Payment Risk Reviewer

AI-assisted transaction review for payment risk teams: **risk level**, **flagged signals**, **recommended action** (approve / review / block), and an **analyst-facing narrative** produced by the **Reviewer Agent** (Groq).

**Decision backbone:** a TypeScript **rules engine** is the **source of truth** for risk level, flagged signals, and recommendation. The **Reviewer Agent** orchestrates each review, **always** runs the rules evaluation first, then interprets and explains those outputs—**never** overriding deterministic results. Reviews are stored in **Supabase** when configured.

**Stack:** Next.js · TypeScript · Supabase · Groq API (Reviewer Agent) · Vercel

**Full agent spec:** [docs/REVIEWER_AGENT.md](./docs/REVIEWER_AGENT.md)

---

## Architecture

| Layer | Responsibility |
|--------|----------------|
| **Frontend** | Transaction form, result cards, loading / empty / error / success |
| **API routes** | Validate input, invoke Reviewer Agent, return stable JSON |
| **Reviewer Agent (Groq)** | Orchestration, analyst summary, structured narrative; calls tools in order |
| **Rules engine (tool)** | Deterministic thresholds, flags, scoring — **authoritative** for risk / signals / recommendation |
| **Supabase (tool)** | Optional persistence of the final review payload |
| **Groq API** | LLM runtime for the single Reviewer Agent |

The browser talks only to **Next.js** on Vercel. Groq and Supabase credentials are **server-side** environment variables.

---

## Diagrams

GitHub renders the Mermaid diagrams below.

### Reviewer Agent + stable JSON (high level)

```mermaid
flowchart TD
    subgraph Client
        U[Analyst]
        FE[Next.js frontend]
    end

    subgraph Server["Next.js API — Vercel"]
        AR[POST /api/review]
        AG[Reviewer Agent]
        MJ[Stable RiskReviewResult JSON]
    end

    RE[Rules engine tool]
    GQ[Groq — agent runtime]
    DB[(Supabase tool)]

    U --> FE
    FE -->|transaction JSON| AR
    AR --> AG
    AG --> GQ
    AG -->|must call first| RE
    RE -->|risk signals recommendation| AG
    AG -->|optional persist| DB
    AG --> MJ
    MJ --> FE
```

### Agent + tools interaction

```mermaid
flowchart LR
    subgraph Agent["Reviewer Agent"]
        O[Orchestrate]
        N[Narrate / explain]
    end

    T1[Rules evaluation tool]
    T2[Supabase persistence tool]

    O --> T1
    T1 -->|deterministic outcome| N
    N --> T2
```

### End-to-end sequence

```mermaid
sequenceDiagram
    participant U as Analyst
    participant FE as Frontend
    participant API as API route
    participant A as Reviewer Agent
    participant R as Rules tool
    participant G as Groq
    participant SB as Supabase

    U->>FE: Submit transaction
    FE->>API: POST /api/review
    API->>API: Validate input
    API->>A: Run review
    A->>R: evaluateTransaction
    R-->>A: risk signals recommendation confidence
    A->>G: Generate analyst summary from frozen outcome
    G-->>A: Narrative text
    A->>SB: persistReview optional
    SB-->>A: id or skip
    A-->>API: Assemble RiskReviewResult
    API-->>FE: 200 JSON
    FE-->>U: Result cards
```

### Rules-first decision backbone

```mermaid
flowchart TD
    TI[Transaction input] --> V{Validate}
    V -->|Invalid| ERR[400 validation error]
    V -->|Valid| RE[Rules engine]

    RE --> RL[risk level]
    RE --> FS[flagged signals]
    RE --> RA[recommendation]

    RL --> SRR[Structured outcome — authoritative]
    FS --> SRR
    RA --> SRR

    SRR --> AG[Reviewer Agent: explain only]
    AG --> OUT[Final payload — same contract]
```

### Frontend UI (unchanged contract)

```mermaid
flowchart TB
    subgraph Main["Main page"]
        FORM[Transaction input form]
        ST{{Frontend state}}
    end

    FORM -.->|submit| ST

    ST -->|empty| EMP[Empty state]
    ST -->|loading| LDG[Loading state]
    ST -->|error| ERR[Error state]
    ST -->|success| RP[Result panel]

    RP --> C1[Transaction Summary]
    RP --> C2[Risk Level]
    RP --> C3[Flagged Signals]
    RP --> C4[Recommended Action]
    RP --> C5[Analyst Summary]
    RP --> C6[Confidence / Notes]
```

### Deployment

```mermaid
flowchart TB
    B[User / Browser]

    subgraph Vercel["Vercel"]
        FE[Next.js frontend]
        AR[API routes + Reviewer Agent]
    end

    SB[(Supabase)]
    GQ[Groq API]

    B <-->|HTTPS| FE
    B <-->|HTTPS JSON| AR
    AR <-->|optional write| SB
    AR <-->|agent LLM| GQ
```

---

## One-line summary for demos

The **Reviewer Agent** (Groq) orchestrates each review: it **always** runs the **deterministic rules engine** first, then writes the **analyst-facing** narrative and returns the **same JSON** the UI already uses. **Supabase** stores the record when configured.

---

## API & data

**`POST /api/review`** — Validates the body, runs the Reviewer Agent pipeline (rules tool → Groq explanation → optional Supabase persist), returns **`RiskReviewResult`** JSON.

**`reviews` table**

| Column | Type / role |
|--------|---------------|
| `id` | UUID primary key |
| `created_at` | Timestamp |
| `input` | JSONB — request payload |
| `risk_level` | Text |
| `recommendation` | Text |
| `signals` | JSONB |
| `rules_version` | Text (e.g. `mvp-1`) |
| `explanation` | Text — final analyst summary |
| `model` | Text, nullable (Groq model id) |

---

## Roadmap

- Auth and Supabase RLS for multi-tenant demos  
- Richer rules and explicit rule versioning  
- Queues or async evaluation if volume grows  

---

## Development

Clone the repository. **`pnpm install`**, **`pnpm dev`**.

**Environment:** copy `.env.example` to `.env.local`. For the full agent pipeline, set **`GROQ_API_KEY`**. Use **`ENABLE_GROQ_EXPLANATION=false`** only if you need template-only summaries (e.g. offline demo). Supabase vars are optional for persistence.

---

## License

See [LICENSE](./LICENSE).
