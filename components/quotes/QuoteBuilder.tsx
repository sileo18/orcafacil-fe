"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerPicker } from "./CustomerPicker";
import { AddItemControls } from "./AddItemControls";
import { QuoteItemCard, type DraftItem } from "./QuoteItemCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { formatCurrency, parseLocaleNumber } from "@/lib/utils/currency";
import { calculateQuotePreview, validateQuoteDraft } from "@/lib/quotes/calculator";
import { useToast } from "@/components/ui/Toast";
import { quotesApi } from "@/lib/api/quotes";
import { ApiError } from "@/lib/api/client";
import type { CreateQuoteInput, DiscountType, Product, QuoteDetail } from "@/lib/types";

function newItemKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;
}

interface QuoteBuilderProps {
  mode: "create" | "edit";
  quoteId?: string;
  initialQuote?: QuoteDetail;
}

/**
 * A tela mais importante da aplicação (PROMPT-APP.md #18): cliente → itens
 * → desconto/frete → total → gerar. O cálculo aqui é só uma prévia — o
 * backend sempre recalcula e é a fonte de verdade (PROMPT-APP.md #10).
 */
export function QuoteBuilder({ mode, quoteId, initialQuote }: QuoteBuilderProps) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const [customerId, setCustomerId] = useState<string | null>(initialQuote?.customerId ?? null);
  const [customerName, setCustomerName] = useState<string | null>(initialQuote?.customerName ?? null);

  const [items, setItems] = useState<DraftItem[]>(() =>
    initialQuote
      ? initialQuote.items.map((item) => ({
          key: newItemKey(),
          productId: item.productId,
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: String(item.unitPrice),
        }))
      : []
  );

  const [discountType, setDiscountType] = useState<DiscountType>(initialQuote?.discountType ?? "Percentage");
  const [discountInput, setDiscountInput] = useState(initialQuote ? String(initialQuote.discountInput) : "0");
  const [additionalFees, setAdditionalFees] = useState(initialQuote ? String(initialQuote.additionalFees) : "0");
  const [validityDays, setValidityDays] = useState(initialQuote ? String(initialQuote.validityDays) : "");
  const [notes, setNotes] = useState(initialQuote?.notes ?? "");

  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSelectCustomer(customer: { id: string; name: string }) {
    setCustomerId(customer.id || null);
    setCustomerName(customer.name || null);
  }

  function handleAddProduct(product: Product) {
    setItems((current) => [
      ...current,
      {
        key: newItemKey(),
        productId: product.id,
        description: product.name,
        quantity: "1",
        unitPrice: String(product.unitPrice),
      },
    ]);
  }

  function handleAddFreeItem() {
    setItems((current) => [
      ...current,
      { key: newItemKey(), productId: null, description: "", quantity: "1", unitPrice: "0" },
    ]);
  }

  function handleItemChange(key: string, patch: Partial<DraftItem>) {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function handleRemoveItem(key: string) {
    setItems((current) => current.filter((item) => item.key !== key));
  }

  const calculation = useMemo(
    () => calculateQuotePreview(items, discountType, discountInput, additionalFees),
    [items, discountType, discountInput, additionalFees]
  );

  const validationError = useMemo(
    () => validateQuoteDraft({ hasCustomer: !!customerId, items, discountType, calculation }),
    [customerId, items, calculation, discountType]
  );

  async function handleSubmit() {
    if (validationError) {
      showError(validationError);
      return;
    }

    const payload: CreateQuoteInput = {
      customerId: customerId as string,
      notes: notes.trim() || null,
      validityDays: validityDays ? Number(validityDays) : null,
      discountType,
      discountInput: calculation.discountValue,
      additionalFees: calculation.feesValue,
      items: items.map((item) => ({
        productId: item.productId,
        description: item.description.trim(),
        quantity: parseLocaleNumber(item.quantity),
        unitPrice: parseLocaleNumber(item.unitPrice),
      })),
    };

    setIsSubmitting(true);
    try {
      const quote =
        mode === "edit" && quoteId ? await quotesApi.update(quoteId, payload) : await quotesApi.create(payload);
      showSuccess(mode === "edit" ? "Orçamento atualizado." : "Orçamento gerado.");
      router.push(`/quotes/${quote.id}`);
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível salvar o orçamento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const submitLabel = mode === "edit" ? "Salvar alterações" : "Gerar orçamento";
  const loadingLabel = mode === "edit" ? "Salvando..." : "Gerando orçamento...";

  return (
    <div className="grid gap-6 pb-32 md:grid-cols-3 md:pb-0">
      <div className="flex flex-col gap-6 md:col-span-2">
        <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
          <h2 className="mb-4 text-base font-semibold text-ink-900">Cliente</h2>
          <CustomerPicker selectedId={customerId} selectedName={customerName} onSelect={handleSelectCustomer} />
        </section>

        <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
          <h2 className="mb-4 text-base font-semibold text-ink-900">Itens</h2>

          {items.length > 0 ? (
            <div className="mb-4 flex flex-col gap-3">
              {items.map((item, index) => (
                <QuoteItemCard
                  key={item.key}
                  item={item}
                  index={index}
                  onChange={handleItemChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </div>
          ) : (
            <p className="mb-4 rounded-lg border border-dashed border-ink-300 px-4 py-6 text-center text-sm text-ink-500">
              Nenhum item adicionado ainda.
            </p>
          )}

          <AddItemControls onAddProduct={handleAddProduct} onAddFreeItem={handleAddFreeItem} />
        </section>

        <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
          <h2 className="mb-4 text-base font-semibold text-ink-900">Desconto, frete e observações</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Tipo de desconto" htmlFor="discountType">
                <Select
                  id="discountType"
                  value={discountType}
                  onChange={(event) => setDiscountType(event.target.value as DiscountType)}
                >
                  <option value="Percentage">Percentual (%)</option>
                  <option value="FixedAmount">Valor (R$)</option>
                </Select>
              </FormField>
              <FormField label={discountType === "Percentage" ? "Desconto (%)" : "Desconto (R$)"} htmlFor="discountInput">
                <Input
                  id="discountInput"
                  inputMode="decimal"
                  value={discountInput}
                  onChange={(event) => setDiscountInput(event.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Frete / taxas (R$)" htmlFor="additionalFees">
              <Input
                id="additionalFees"
                inputMode="decimal"
                value={additionalFees}
                onChange={(event) => setAdditionalFees(event.target.value)}
              />
            </FormField>

            <FormField
              label="Validade do orçamento (dias)"
              htmlFor="validityDays"
              hint="Deixe em branco para usar o padrão da sua empresa."
            >
              <Input
                id="validityDays"
                inputMode="numeric"
                value={validityDays}
                onChange={(event) => setValidityDays(event.target.value)}
                placeholder="Ex: 15"
              />
            </FormField>

            <FormField label="Observações (opcional)" htmlFor="notes">
              <Textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={3} />
            </FormField>
          </div>
        </section>
      </div>

      <div className="md:col-span-1">
        <div className="rounded-xl border border-ink-200 bg-white p-4 sm:sticky sm:top-6 sm:p-6 dark:bg-ink-50">
          <h2 className="mb-4 text-base font-semibold text-ink-900">Resumo</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Subtotal</dt>
              <dd className="font-medium text-ink-900">{formatCurrency(calculation.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Desconto</dt>
              <dd className="font-medium text-ink-900">- {formatCurrency(calculation.discountAmount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Frete / taxas</dt>
              <dd className="font-medium text-ink-900">{formatCurrency(calculation.feesValue)}</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-ink-200 pt-3 text-base">
              <dt className="font-semibold text-ink-900">Total</dt>
              <dd className="font-semibold text-brand-700">{formatCurrency(calculation.total)}</dd>
            </div>
          </dl>

          {validationError ? (
            <p role="status" className="mt-4 rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-200">
              {validationError}
            </p>
          ) : null}

          <Button
            type="button"
            size="lg"
            fullWidth
            className="mt-5 hidden md:flex"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText={loadingLabel}
            disabled={!!validationError}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      {/* Botão principal sempre visível no mobile (PROMPT-MOBILEFIRST.md #9). */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-ink-200 bg-white px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)] md:hidden dark:bg-ink-50">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-ink-500">Total</span>
          <span className="text-lg font-semibold text-ink-900">{formatCurrency(calculation.total)}</span>
        </div>
        <Button
          type="button"
          size="lg"
          fullWidth
          onClick={handleSubmit}
          isLoading={isSubmitting}
          loadingText={loadingLabel}
          disabled={!!validationError}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
