import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger";

const variants: Record<Variant, string> = {
  neutral: "bg-slate-100 text-slate-800 border-slate-200",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200",
  warning: "bg-amber-50 text-amber-900 border-amber-200",
  danger: "bg-rose-50 text-rose-900 border-rose-200",
};

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
