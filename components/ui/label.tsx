import type { LabelHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Label({
  children,
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold tracking-wide text-slate-700",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}
