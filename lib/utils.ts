/** Merge class names — no extra deps for MVP. */
export function cn(...parts: Array<string | undefined | false>): string {
  return parts.filter(Boolean).join(" ");
}
