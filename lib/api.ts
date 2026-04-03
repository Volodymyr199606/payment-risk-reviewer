import type {
  RiskReviewResult,
  TransactionReviewRequest,
  ApiErrorBody,
} from "@/types/review";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly body?: ApiErrorBody;

  constructor(
    message: string,
    status: number,
    code: string,
    body?: ApiErrorBody,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.body = body;
  }
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export async function postReview(
  body: TransactionReviewRequest,
): Promise<RiskReviewResult> {
  const res = await fetch("/api/review", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const err = payload as ApiErrorBody | null;
    const message =
      err?.error?.message ?? `Request failed (${res.status})`;
    const code = err?.error?.code ?? "UNKNOWN";
    throw new ApiError(message, res.status, code, err ?? undefined);
  }

  return payload as RiskReviewResult;
}
