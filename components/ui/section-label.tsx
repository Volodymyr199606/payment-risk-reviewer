import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small uppercase section label for scan-friendly hierarchy. */
export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600",
        className,
      )}
    >
      {children}
    </p>
  );
}
