"use client";

import { useState } from "react";
import type { RiskReviewResult } from "@/types/review";
import { postReview, ApiError } from "@/lib/api";
import { Alert } from "@/components/ui/alert";
import { TransactionReviewForm } from "@/components/features/risk-review/TransactionReviewForm";
import { RiskReviewResultPanel } from "@/components/features/risk-review/RiskReviewResultPanel";
import { ResultSkeleton } from "@/components/features/risk-review/ResultSkeleton";

type Phase = "idle" | "loading" | "success";

export function RiskReviewExperience() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<RiskReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(body: Parameters<typeof postReview>[0]) {
    setError(null);
    setResult(null);
    setPhase("loading");
    try {
      const data = await postReview(body);
      setResult(data);
      setPhase("success");
    } catch (e) {
      setPhase("idle");
      if (e instanceof ApiError) {
        setError(e.message);
      } else {
        setError("Something went wrong. Check the console and try again.");
        console.error(e);
      }
    }
  }

  const showEmpty = phase === "idle" && !result && !error;
  const showSuccessPanel = phase === "success" && result;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Payment Risk Reviewer
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Transaction risk review
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Submit transaction context for a rules-first assessment. Results include
          risk level, flagged signals, a recommended action, and an analyst-facing
          summary.
        </p>
      </header>

      <TransactionReviewForm
        onSubmit={handleSubmit}
        disabled={phase === "loading"}
      />

      {error && phase === "idle" ? (
        <Alert tone="error">{error}</Alert>
      ) : null}

      {showEmpty ? (
        <Alert tone="info">
          Run a review to see risk level, signals, recommendation, and confidence
          in structured cards below.
        </Alert>
      ) : null}

      {phase === "loading" ? (
        <section aria-busy aria-label="Loading review results">
          <ResultSkeleton />
        </section>
      ) : null}

      {showSuccessPanel && result ? (
        <section aria-label="Review results">
          <RiskReviewResultPanel result={result} />
        </section>
      ) : null}
    </div>
  );
}
