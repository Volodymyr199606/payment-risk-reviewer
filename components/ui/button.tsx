import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white shadow-md shadow-slate-900/30 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/25 active:scale-[0.98] active:shadow-md disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
  secondary:
    "border border-slate-300 bg-white text-slate-900 shadow-sm hover:border-slate-400 hover:bg-slate-50 active:scale-[0.99] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
  ghost:
    "text-slate-700 hover:bg-slate-100 active:bg-slate-200/80 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
};

export function Button({
  children,
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-[44px] min-w-[160px] items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-150",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
