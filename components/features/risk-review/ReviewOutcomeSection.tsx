import type { Recommendation, RiskLevel } from "@/types/review";
import { Card } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const recCopy: Record<Recommendation, string> = {
  approve: "Proceed under standard policy.",
  review: "Hold for analyst review before releasing funds.",
  block: "Do not approve without escalation.",
};

function recStyles(r: Recommendation): {
  border: string;
  bg: string;
  badge: "success" | "warning" | "danger";
} {
  if (r === "approve")
    return {
      border: "border-emerald-600",
      bg: "bg-emerald-50/80",
      badge: "success",
    };
  if (r === "review")
    return {
      border: "border-amber-500",
      bg: "bg-amber-50/80",
      badge: "warning",
    };
  return {
    border: "border-rose-600",
    bg: "bg-rose-50/80",
    badge: "danger",
  };
}

function recVerbClass(r: Recommendation): string {
  if (r === "approve") return "text-emerald-950";
  if (r === "review") return "text-amber-950";
  return "text-rose-950";
}

function riskColumnBorder(level: RiskLevel): string {
  if (level === "low")
    return "border-t-4 border-t-emerald-500 md:border-t-0 md:border-l-4 md:border-l-emerald-500";
  if (level === "medium")
    return "border-t-4 border-t-amber-500 md:border-t-0 md:border-l-4 md:border-l-amber-500";
  return "border-t-4 border-t-rose-600 md:border-t-0 md:border-l-4 md:border-l-rose-600";
}

function riskPillClass(level: RiskLevel): string {
  if (level === "low")
    return "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-300/60 shadow-sm shadow-emerald-900/5";
  if (level === "medium")
    return "bg-amber-50 text-amber-950 ring-1 ring-amber-300/60 shadow-sm shadow-amber-900/5";
  return "bg-rose-50 text-rose-950 ring-1 ring-rose-300/60 shadow-sm shadow-rose-900/5";
}

function riskBadgeVariant(
  level: RiskLevel,
): "success" | "warning" | "danger" {
  if (level === "low") return "success";
  if (level === "medium") return "warning";
  return "danger";
}

export function ReviewOutcomeSection({
  recommendation,
  riskLevel,
}: {
  recommendation: Recommendation;
  riskLevel: RiskLevel;
}) {
  const rs = recStyles(recommendation);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionLabel>Review outcome</SectionLabel>
        <span className="text-[10px] font-medium uppercase tracking-wider text-sky-800/90">
          Decision snapshot
        </span>
      </div>
      <Card variant="emphasis" className="p-0 overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.28fr)_minmax(0,0.82fr)] md:divide-x md:divide-slate-200/90">
          <div
            className={cn(
              "relative border-l-[6px] px-6 py-7 pl-5 sm:px-8 sm:pl-6",
              rs.border,
              rs.bg,
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                Recommended action
              </p>
              <Badge variant={rs.badge} className="text-[10px]">
                Primary
              </Badge>
            </div>
            <p
              className={cn(
                "mt-3 text-[1.875rem] font-bold capitalize leading-none tracking-tight sm:text-[2.25rem]",
                recVerbClass(recommendation),
              )}
            >
              {recommendation}
            </p>
            <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-800">
              {recCopy[recommendation]}
            </p>
          </div>
          <div
            className={cn(
              "flex flex-col justify-center border-slate-200/90 bg-white px-6 py-6 md:py-7 md:pr-8 md:pl-6",
              riskColumnBorder(riskLevel),
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Risk level
              </p>
              <Badge variant={riskBadgeVariant(riskLevel)} className="text-[10px]">
                Status
              </Badge>
            </div>
            <div className="mt-3">
              <span
                className={cn(
                  "inline-flex rounded-xl px-4 py-2 text-xl font-bold capitalize tracking-tight",
                  riskPillClass(riskLevel),
                )}
              >
                {riskLevel}
              </span>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
              Deterministic assessment from current transaction attributes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
