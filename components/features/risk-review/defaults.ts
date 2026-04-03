import type { TransactionReviewRequest } from "@/types/review";

/** Demo-friendly defaults — matches architecture sample payload. */
export const defaultReviewRequest: TransactionReviewRequest = {
  transactionId: "txn_8f3a2c",
  amount: 129.99,
  currency: "USD",
  merchantName: "QuickMart Online",
  merchantCategoryCode: "5411",
  cardholderCountry: "US",
  merchantCountry: "EE",
  channel: "ecommerce",
  accountAgeDays: 2,
  priorDisputeCount: 1,
  velocity24hCount: 6,
  notes: "",
};
