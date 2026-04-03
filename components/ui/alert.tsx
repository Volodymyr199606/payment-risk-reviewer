import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "error" | "info";

const tones: Record<Tone, string> = {
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-slate-50 text-slate-800",
};

export function Alert({
  children,
  tone = "info",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-relaxed",
        tones[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
