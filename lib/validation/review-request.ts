import { z } from "zod";

const channel = z.enum(["ecommerce", "pos", "unknown"]);

/** Server-side validation for POST /api/review — keep in sync with types/review.ts */
export const transactionReviewRequestSchema = z.object({
  transactionId: z.string().min(1).max(128),
  amount: z.number().positive().finite(),
  currency: z
    .string()
    .length(3)
    .transform((s) => s.toUpperCase()),
  merchantName: z.string().min(1).max(120),
  merchantCategoryCode: z.string().min(1).max(32),
  cardholderCountry: z
    .string()
    .length(2)
    .transform((s) => s.toUpperCase()),
  merchantCountry: z
    .string()
    .length(2)
    .transform((s) => s.toUpperCase()),
  channel,
  accountAgeDays: z.number().int().min(0).max(365_000),
  priorDisputeCount: z.number().int().min(0).max(1_000_000),
  velocity24hCount: z.number().int().min(0).max(1_000_000),
  notes: z.string().max(500).optional(),
});

export type TransactionReviewRequestParsed = z.infer<
  typeof transactionReviewRequestSchema
>;
