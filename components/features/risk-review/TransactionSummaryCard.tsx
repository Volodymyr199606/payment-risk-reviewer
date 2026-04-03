import type { TransactionEcho } from "@/types/review";
import { Card, CardTitle } from "@/components/ui/card";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-100 py-2 last:border-0 sm:flex-row sm:items-baseline sm:justify-between">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
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
    <Card>
      <CardTitle>Transaction summary</CardTitle>
      <div className="mt-4 space-y-0">
        <Row label="Transaction ID" value={transaction.transactionId} />
        <Row label="Amount" value={amount} />
        <Row label="Merchant" value={transaction.merchantName} />
        <Row label="MCC" value={transaction.merchantCategoryCode} />
        <Row
          label="Cardholder / merchant country"
          value={`${transaction.cardholderCountry} → ${transaction.merchantCountry}`}
        />
        <Row label="Channel" value={transaction.channel} />
      </div>
    </Card>
  );
}
