import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "neutral" | "success" | "warning" | "danger" | "info";

const variants: Record<Variant, string> = {
  neutral: "bg-slate-100 text-slate-800 border-slate-200/90",
  success: "bg-emerald-50 text-emerald-900 border-emerald-200/90",
  warning: "bg-amber-50 text-amber-950 border-amber-200/90",
  danger: "bg-rose-50 text-rose-950 border-rose-200/90",
  info: "bg-sky-50 text-sky-950 border-sky-200/80",
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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors duration-150",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
