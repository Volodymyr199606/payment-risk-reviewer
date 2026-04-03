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
  if (r === "approve") return "border-emerald-500";
  if (r === "review") return "border-amber-500";
  return "border-rose-500";
}

function riskAccent(level: RiskLevel): string {
  if (level === "low") return "text-emerald-800";
  if (level === "medium") return "text-amber-900";
  return "text-rose-900";
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
        <div className="grid gap-0 md:grid-cols-2 md:divide-x md:divide-slate-100">
          <div
            className={cn(
              "border-l-4 bg-slate-50/50 px-6 py-6 pl-5 sm:pl-6",
              recAccent(recommendation),
            )}
          >
            <p className="text-xs font-medium text-slate-500">
              Recommended action
            </p>
            <p className="mt-2 text-2xl font-semibold capitalize tracking-tight text-slate-900 sm:text-[1.75rem]">
              {recommendation}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
              {recCopy[recommendation]}
            </p>
          </div>
          <div className="flex flex-col justify-center border-t border-slate-100 p-6 md:border-t-0 md:pr-7">
            <p className="text-xs font-medium text-slate-500">Risk level</p>
            <p
              className={cn(
                "mt-2 text-2xl font-semibold capitalize tracking-tight sm:text-[1.75rem]",
                riskAccent(riskLevel),
              )}
            >
              {riskLevel}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Rule-based assessment from current transaction attributes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
