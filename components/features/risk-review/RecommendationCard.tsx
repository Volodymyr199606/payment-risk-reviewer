import type { Recommendation } from "@/types/review";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function recVariant(
  r: Recommendation,
): "success" | "warning" | "danger" {
  if (r === "approve") return "success";
  if (r === "review") return "warning";
  return "danger";
}

const copy: Record<Recommendation, string> = {
  approve: "Proceed under standard policy.",
  review: "Hold for analyst review before releasing funds.",
  block: "Do not approve without escalation.",
};

export function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <Card>
      <CardTitle>Recommended action</CardTitle>
      <div className="mt-4 space-y-2">
        <Badge variant={recVariant(recommendation)} className="text-sm uppercase">
          {recommendation}
        </Badge>
        <p className="text-sm text-slate-600">{copy[recommendation]}</p>
      </div>
    </Card>
  );
}
