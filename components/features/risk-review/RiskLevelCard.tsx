import type { RiskLevel } from "@/types/review";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function riskVariant(
  level: RiskLevel,
): "success" | "warning" | "danger" {
  if (level === "low") return "success";
  if (level === "medium") return "warning";
  return "danger";
}

export function RiskLevelCard({ riskLevel }: { riskLevel: RiskLevel }) {
  return (
    <Card>
      <CardTitle>Risk level</CardTitle>
      <div className="mt-4 flex items-center gap-3">
        <Badge variant={riskVariant(riskLevel)} className="text-sm capitalize">
          {riskLevel}
        </Badge>
        <p className="text-sm text-slate-600">
          Rule-based assessment for this transaction context.
        </p>
      </div>
    </Card>
  );
}
