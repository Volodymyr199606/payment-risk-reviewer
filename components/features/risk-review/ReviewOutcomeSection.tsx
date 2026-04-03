import type { Recommendation, RiskLevel } from "@/types/review";
import { Card } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { cn } from "@/lib/utils";

const recCopy: Record<Recommendation, string> = {
  approve: "Proceed under standard policy.",
  review: "Hold for analyst review before releasing funds.",
  block: "Do not approve without escalation.",
};

function recAccent(r: Recommendation): string {
  if (r === "approve") return "border-emerald-600";
  if (r === "review") return "border-amber-500";
  return "border-rose-600";
}

function recVerbClass(r: Recommendation): string {
  if (r === "approve") return "text-emerald-950";
  if (r === "review") return "text-amber-950";
  return "text-rose-950";
}

function riskPillClass(level: RiskLevel): string {
  if (level === "low") return "bg-emerald-50 text-emerald-900 ring-emerald-200/80";
  if (level === "medium") return "bg-amber-50 text-amber-950 ring-amber-200/80";
  return "bg-rose-50 text-rose-950 ring-rose-200/80";
}

export function ReviewOutcomeSection({
  recommendation,
  riskLevel,
}: {
  recommendation: Recommendation;
  riskLevel: RiskLevel;
}) {
  return (
    <div className="space-y-3">
      <SectionLabel>Review outcome</SectionLabel>
      <Card variant="emphasis" className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] md:divide-x md:divide-slate-200/90">
          <div
            className={cn(
              "relative border-l-[5px] bg-slate-100/90 px-6 py-7 pl-5 sm:px-8 sm:pl-6",
              recAccent(recommendation),
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              Recommended action
            </p>
            <p
              className={cn(
                "mt-3 text-[1.75rem] font-bold capitalize leading-none tracking-tight sm:text-[2.125rem]",
                recVerbClass(recommendation),
              )}
            >
              {recommendation}
            </p>
            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-700">
              {recCopy[recommendation]}
            </p>
          </div>
          <div className="flex flex-col justify-center border-t border-slate-200/90 bg-white px-6 py-6 md:border-t-0 md:py-7 md:pr-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              Risk level
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex rounded-lg px-3 py-1.5 text-lg font-bold capitalize tracking-tight ring-1 ring-inset",
                  riskPillClass(riskLevel),
                )}
              >
                {riskLevel}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
              Derived from deterministic rules on this transaction context.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
