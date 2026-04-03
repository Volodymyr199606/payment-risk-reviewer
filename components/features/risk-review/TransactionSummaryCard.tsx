import type { TransactionEcho } from "@/types/review";
import { Card } from "@/components/ui/card";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-200/60 py-2.5 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-slate-800 sm:max-w-[60%]">
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
      <p className="text-xs font-semibold text-slate-700">Summary</p>
      <div className="mt-3">
        <Row label="Transaction ID" value={transaction.transactionId} />
        <Row label="Amount" value={amount} />
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
