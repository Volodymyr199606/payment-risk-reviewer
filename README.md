# Payment Risk Reviewer

AI-assisted transaction review for payment risk teams: **risk level**, **flagged signals**, **recommended action** (approve / review / block), and an **analyst-facing explanation** from Groq.

**Rules-first MVP:** a TypeScript **rules engine** decides the outcome. **Groq** generates explanation text from the same structured inputs; it does **not** override the recommendation. Reviews are stored in **Supabase**.

**Stack:** Next.js · TypeScript · Supabase · Groq API · Vercel

---

## Architecture

| Layer | Responsibility |
|--------|----------------|
| **Frontend** | Transaction form, result cards, loading / empty / error / success |
| **API routes** | Validate input, run rules, call Groq when enabled, persist to Supabase, return JSON |
| **Rules engine** | Deterministic thresholds, flags, scoring |
| **Groq** | Explanation layer only (narrative from rule outputs) |
| **Supabase** | PostgreSQL persistence for reviews |

The browser talks to **Next.js API routes** on Vercel. Groq and Supabase credentials are server-side environment variables.

---

## Diagrams

GitHub renders the Mermaid diagrams below.

### High-level request flow

```mermaid
flowchart TD
    subgraph Client
        U[Analyst]
        FE[Next.js frontend]
        RC[Result cards]
    end

    subgraph Server["Next.js API (Vercel)"]
        AR[API route]
        V[Validate input]
        RE[Rules engine]
        MJ[Stable JSON response]
    end

    GQ[Groq API]
    DB[(Supabase)]

    U --> FE
    FE -->|POST request| AR
    AR --> V --> RE
    RE -.->|optional| GQ
    RE --> MJ
    GQ --> MJ
    MJ --> DB
    MJ -->|JSON| FE
    FE --> RC
```

### Request/response: `POST /api/review`

```mermaid
sequenceDiagram
    participant RA as Risk Analyst
    participant FE as Next.js Frontend
    participant AR as Next.js API Route
    participant RE as Rules Engine
    participant GQ as Groq API
    participant SB as Supabase

    RA->>FE: Enter transaction data
    FE->>AR: POST /api/review (JSON body)
    Note over AR: Validate input
    AR->>RE: Evaluate(transaction context)
    RE-->>AR: Risk level, signals, recommendation
    opt Explanation enabled
        AR->>GQ: Generate analyst explanation
        GQ-->>AR: Explanation text
    end
    AR->>SB: Persist review (input + outcome)
    SB-->>AR: Acknowledge write
    AR-->>FE: 200 OK — structured JSON
    FE-->>RA: Display result cards
```

### Rules-first evaluation

```mermaid
flowchart TD
    TI[Transaction input] --> V{Validate input}
    V -->|Invalid| ERR[Validation error]
    V -->|Valid| RE[Rules engine]

    RE --> RL[Risk level]
    RE --> FS[Flagged signals]
    RE --> RA[Recommended action]

    RL --> SRR[Structured review result]
    FS --> SRR
    RA --> SRR

    SRR --> MERGE[Final response payload]
    SRR --> G{Optional Groq?}
    G -->|Yes| LLM[Groq: analyst explanation — narrative only]
    LLM --> MERGE
```

### Frontend UI

```mermaid
flowchart TB
    subgraph Main["Main page (single-page MVP)"]
        FORM[Transaction input form]
        ST{{Frontend state}}
    end

    FORM -.->|submit / reset| ST

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

    subgraph Vercel["Vercel — hosting"]
        FE[Next.js frontend]
        AR[Server-side API routes]
    end

    SB[(Supabase — database)]
    GQ[Groq API — external]

    B <-->|HTTPS: pages & assets| FE
    B <-->|HTTPS: API calls & JSON| AR
    AR <-->|queries / writes| SB
    AR <-->|HTTPS: explanation requests| GQ
```

---

## API & data

**`POST /api/review`** — Validate the body, run the rules engine, optionally attach a Groq explanation, write to Supabase, return JSON.

**`reviews` table**

| Column | Type / role |
|--------|-------------|
| `id` | UUID primary key |
| `created_at` | Timestamp |
| `input` | JSONB — request payload |
| `risk_level` | Text |
| `recommendation` | Text |
| `signals` | JSONB |
| `rules_version` | Text (e.g. `v1`) |
| `explanation` | Text |
| `model` | Text, nullable (Groq model id) |

---

## Roadmap

- Auth and Supabase RLS for multi-tenant demos  
- Richer rules and explicit rule versioning  
- Queues or async evaluation if volume grows  

---

## Development

Clone the repository. When the Next.js app is in-repo: **`pnpm install`**, **`pnpm dev`**.

---

## License

See [LICENSE](./LICENSE).
