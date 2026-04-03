"use client";

import { useState } from "react";
import type { RiskReviewResult } from "@/types/review";
import { postReview, ApiError } from "@/lib/api";
import { Alert } from "@/components/ui/alert";
import { SectionLabel } from "@/components/ui/section-label";
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
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-slate-300/80 pb-10">
        <SectionLabel>Payment Risk Reviewer</SectionLabel>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-[2.125rem] sm:leading-[1.15]">
          Transaction risk review
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] font-medium leading-relaxed text-slate-600">
          Enter transaction context for a deterministic rules assessment. The
          outcome highlights recommended action, risk level, and signals before
          supporting detail.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        <section aria-labelledby="input-heading">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2
                id="input-heading"
                className="text-sm font-semibold text-slate-800"
              >
                Input
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Required fields are validated before submit.
              </p>
            </div>
          </div>
          <TransactionReviewForm
            onSubmit={handleSubmit}
            disabled={phase === "loading"}
          />
        </section>

        {error && phase === "idle" ? (
          <Alert tone="error">{error}</Alert>
        ) : null}

        {showEmpty ? (
          <Alert tone="info">
            Submit the form to see the review outcome: decision first, then
            signals and context below.
          </Alert>
        ) : null}

        {phase === "loading" ? (
          <section aria-busy aria-label="Loading review results">
            <div className="mb-4">
              <SectionLabel>Results</SectionLabel>
              <p className="mt-1 text-xs text-slate-500">Generating review…</p>
            </div>
            <ResultSkeleton />
          </section>
        ) : null}

        {showSuccessPanel && result ? (
          <section aria-labelledby="results-heading" className="space-y-4">
            <div>
              <h2
                id="results-heading"
                className="text-sm font-semibold text-slate-800"
              >
                Results
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Decision and evidence for this submission.
              </p>
            </div>
            <RiskReviewResultPanel result={result} />
          </section>
        ) : null}
      </div>
    </div>
  );
}
