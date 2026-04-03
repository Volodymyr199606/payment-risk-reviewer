import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** default: standard panel · muted: supporting context · emphasis: primary decision/signals */
type CardVariant = "default" | "muted" | "emphasis";

const variantClass: Record<CardVariant, string> = {
  default:
    "rounded-xl border border-slate-200/90 bg-[var(--surface)] p-6 shadow-sm shadow-slate-900/5",
  muted:
    "rounded-xl border border-slate-200/70 bg-[var(--surface-muted)] p-5 shadow-sm shadow-slate-900/[0.02]",
  emphasis:
    "rounded-2xl border border-slate-200/95 bg-[var(--surface)] p-6 shadow-md shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.04]",
};

export function Card({
  children,
  className,
  variant = "default",
}: {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}) {
  return (
    <div className={cn(variantClass[variant], className)}>{children}</div>
  );
}

export function CardTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-sm font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("mt-1 text-sm text-slate-600", className)}>{children}</p>
  );
}
