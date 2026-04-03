import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[88px] w-full resize-y rounded-lg border border-slate-300/90 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-colors duration-150 placeholder:text-slate-400 hover:border-slate-400/90 focus:border-slate-500 focus:ring-2 focus:ring-sky-500/25 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
}
