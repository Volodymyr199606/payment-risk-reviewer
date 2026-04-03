"use client";

import { useState, type ReactNode } from "react";
import type { PaymentChannel, TransactionReviewRequest } from "@/types/review";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { defaultReviewRequest } from "@/components/features/risk-review/defaults";

function parseRequest(
  raw: Record<string, string>,
): { ok: true; value: TransactionReviewRequest } | { ok: false; message: string } {
  const amount = Number(raw.amount);
  const accountAgeDays = Number.parseInt(raw.accountAgeDays, 10);
  const priorDisputeCount = Number.parseInt(raw.priorDisputeCount, 10);
  const velocity24hCount = Number.parseInt(raw.velocity24hCount, 10);

  if (!raw.transactionId.trim()) return { ok: false, message: "Transaction ID is required." };
  if (!Number.isFinite(amount) || amount <= 0)
    return { ok: false, message: "Amount must be a positive number." };
  if (!/^[A-Za-z]{3}$/.test(raw.currency))
    return { ok: false, message: "Currency must be a 3-letter code (e.g. USD)." };
  if (!raw.merchantName.trim()) return { ok: false, message: "Merchant name is required." };
  if (!raw.merchantCategoryCode.trim())
    return { ok: false, message: "Merchant category code is required." };
  if (!/^[A-Za-z]{2}$/.test(raw.cardholderCountry))
    return { ok: false, message: "Cardholder country must be 2 letters (e.g. US)." };
  if (!/^[A-Za-z]{2}$/.test(raw.merchantCountry))
    return { ok: false, message: "Merchant country must be 2 letters." };
  if (!["ecommerce", "pos", "unknown"].includes(raw.channel))
    return { ok: false, message: "Invalid channel." };
  if (!Number.isFinite(accountAgeDays) || accountAgeDays < 0)
    return { ok: false, message: "Account age must be zero or positive." };
  if (!Number.isFinite(priorDisputeCount) || priorDisputeCount < 0)
    return { ok: false, message: "Prior dispute count must be zero or positive." };
  if (!Number.isFinite(velocity24hCount) || velocity24hCount < 0)
    return { ok: false, message: "Velocity must be zero or positive." };

  const value: TransactionReviewRequest = {
    transactionId: raw.transactionId.trim(),
    amount,
    currency: raw.currency.toUpperCase(),
    merchantName: raw.merchantName.trim(),
    merchantCategoryCode: raw.merchantCategoryCode.trim(),
    cardholderCountry: raw.cardholderCountry.toUpperCase(),
    merchantCountry: raw.merchantCountry.toUpperCase(),
    channel: raw.channel as PaymentChannel,
    accountAgeDays,
    priorDisputeCount,
    velocity24hCount,
  };
  return { ok: true, value };
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200/95 bg-slate-50/60 p-4 shadow-sm shadow-slate-900/[0.04] transition-[border-color,box-shadow] duration-200 hover:border-slate-300/90 hover:shadow-md hover:shadow-slate-900/[0.06]">
      <p className="mb-3 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
        <span
          className="h-2 w-2 shrink-0 rounded-sm bg-sky-600/90"
          aria-hidden
        />
        {title}
      </p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

const formCardClass =
  "border-slate-300/95 bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/[0.08]";

export function TransactionReviewForm({
  onSubmit,
  disabled,
}: {
  onSubmit: (body: TransactionReviewRequest) => void | Promise<void>;
  disabled?: boolean;
}) {
  const d = defaultReviewRequest;
  const [fields, setFields] = useState({
    transactionId: d.transactionId,
    amount: String(d.amount),
    currency: d.currency,
    merchantName: d.merchantName,
    merchantCategoryCode: d.merchantCategoryCode,
    cardholderCountry: d.cardholderCountry,
    merchantCountry: d.merchantCountry,
    channel: d.channel,
    accountAgeDays: String(d.accountAgeDays),
    priorDisputeCount: String(d.priorDisputeCount),
    velocity24hCount: String(d.velocity24hCount),
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseRequest(fields);
    if (!parsed.ok) {
      setValidationError(parsed.message);
      return;
    }
    setValidationError(null);
    void onSubmit(parsed.value);
  }

  return (
    <Card variant="default" className={formCardClass}>
      <div className="border-b border-slate-200/90 pb-5">
        <p className="text-lg font-semibold tracking-tight text-slate-900">
          Transaction details
        </p>
        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">
          Server-side rules-first evaluation. Use standard currency and country
          codes.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <FieldGroup title="Reference">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={fields.transactionId}
                onChange={(e) =>
                  setFields((f) => ({ ...f, transactionId: e.target.value }))
                }
                disabled={disabled}
                autoComplete="off"
              />
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="Amount">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={fields.amount}
                onChange={(e) =>
                  setFields((f) => ({ ...f, amount: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={fields.currency}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    currency: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={3}
                disabled={disabled}
              />
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="Merchant">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="merchantName">Merchant name</Label>
              <Input
                id="merchantName"
                value={fields.merchantName}
                onChange={(e) =>
                  setFields((f) => ({ ...f, merchantName: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="merchantCategoryCode">Category (MCC)</Label>
              <Input
                id="merchantCategoryCode"
                value={fields.merchantCategoryCode}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    merchantCategoryCode: e.target.value,
                  }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="channel">Channel</Label>
              <Select
                id="channel"
                value={fields.channel}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    channel: e.target.value as PaymentChannel,
                  }))
                }
                disabled={disabled}
              >
                <option value="ecommerce">E-commerce</option>
                <option value="pos">POS</option>
                <option value="unknown">Unknown</option>
              </Select>
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="Geography">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cardholderCountry">Cardholder country</Label>
              <Input
                id="cardholderCountry"
                value={fields.cardholderCountry}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    cardholderCountry: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={2}
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="merchantCountry">Merchant country</Label>
              <Input
                id="merchantCountry"
                value={fields.merchantCountry}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    merchantCountry: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={2}
                disabled={disabled}
              />
            </div>
          </div>
        </FieldGroup>

        <FieldGroup title="Behavioral Signals">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="accountAgeDays">Account age (days)</Label>
              <Input
                id="accountAgeDays"
                type="number"
                min="0"
                value={fields.accountAgeDays}
                onChange={(e) =>
                  setFields((f) => ({ ...f, accountAgeDays: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="priorDisputeCount">Prior disputes</Label>
              <Input
                id="priorDisputeCount"
                type="number"
                min="0"
                value={fields.priorDisputeCount}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    priorDisputeCount: e.target.value,
                  }))
                }
                disabled={disabled}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-3 md:col-span-1">
              <Label htmlFor="velocity24hCount">Velocity (24h)</Label>
              <Input
                id="velocity24hCount"
                type="number"
                min="0"
                value={fields.velocity24hCount}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    velocity24hCount: e.target.value,
                  }))
                }
                disabled={disabled}
              />
            </div>
          </div>
        </FieldGroup>

        {validationError ? (
          <p className="text-sm text-red-700" role="status">
            {validationError}
          </p>
        ) : null}

        <div className="mt-1 rounded-lg border border-slate-200/80 bg-slate-50/70 px-4 py-5 sm:px-5">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="submit"
              disabled={disabled}
              className="w-full min-w-0 shadow-lg shadow-slate-900/25 ring-1 ring-slate-900/10 sm:w-auto sm:min-w-[192px]"
            >
              {disabled ? "Evaluating…" : "Run risk review"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
}
