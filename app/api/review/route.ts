import { NextResponse } from "next/server";
import { runReviewerAgent } from "@/lib/agent/reviewer-agent";
import { transactionReviewRequestSchema } from "@/lib/validation/review-request";
import type { TransactionReviewRequest } from "@/types/review";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body must be JSON",
        },
      },
      { status: 400 },
    );
  }

  const parsed = transactionReviewRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid transaction payload",
          details: parsed.error.flatten(),
        },
      },
      { status: 400 },
    );
  }

  const input = parsed.data as TransactionReviewRequest;
  const result = await runReviewerAgent(input);

  return NextResponse.json(result);
}
