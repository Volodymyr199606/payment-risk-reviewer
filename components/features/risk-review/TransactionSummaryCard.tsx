import type { TransactionEcho } from "@/types/review";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1 border-b border-slate-200/80 py-2.5 last:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        emphasize &&
          "rounded-md border-slate-200/90 bg-slate-50/90 px-3 -mx-1 sm:-mx-0",
      )}
    >
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </span>
      <span
        className={cn(
          "text-right tabular-nums text-slate-800",
          emphasize ? "text-base font-semibold text-slate-900" : "text-sm font-medium",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function TransactionSummaryCard({
  transaction,
}: {
  transaction: TransactionEcho;
}) {
  const amount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: transaction.currency,
  }).format(transaction.amount);

  return (
    <Card variant="muted" className="p-5 sm:p-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
        Transaction context
      </p>
      <div className="mt-4 space-y-0">
        <Row label="Transaction ID" value={transaction.transactionId} />
        <Row label="Amount" value={amount} emphasize />
        <Row label="Merchant" value={transaction.merchantName} />
        <Row label="MCC" value={transaction.merchantCategoryCode} />
        <Row
          label="Cardholder → merchant"
          value={`${transaction.cardholderCountry} → ${transaction.merchantCountry}`}
        />
        <Row label="Channel" value={transaction.channel} />
      </div>
    </Card>
  );
}
