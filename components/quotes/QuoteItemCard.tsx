"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrency, parseLocaleNumber } from "@/lib/utils/currency";

export interface DraftItem {
  key: string;
  productId: string | null;
  description: string;
  quantity: string;
  unitPrice: string;
}

interface QuoteItemCardProps {
  item: DraftItem;
  index: number;
  onChange: (key: string, patch: Partial<DraftItem>) => void;
  onRemove: (key: string) => void;
}

/**
 * Cada item é um card vertical simples — nunca uma tabela horizontal
 * difícil de manipular no celular (PROMPT-MOBILEFIRST.md #17).
 */
export function QuoteItemCard({ item, index, onChange, onRemove }: QuoteItemCardProps) {
  const quantity = parseLocaleNumber(item.quantity);
  const unitPrice = parseLocaleNumber(item.unitPrice);
  const total = quantity * unitPrice;

  return (
    <div className="rounded-lg border border-ink-200 bg-white p-3.5 dark:bg-ink-50">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">Item {index + 1}</span>
        <button
          type="button"
          onClick={() => onRemove(item.key)}
          className="flex h-9 items-center gap-1.5 rounded-md px-2 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
          aria-label={`Remover item ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          Remover
        </button>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-800" htmlFor={`desc-${item.key}`}>
            Descrição
          </label>
          <Input
            id={`desc-${item.key}`}
            value={item.description}
            onChange={(event) => onChange(item.key, { description: event.target.value })}
            placeholder="Ex: Corte de cabelo"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800" htmlFor={`qty-${item.key}`}>
              Quantidade
            </label>
            <Input
              id={`qty-${item.key}`}
              inputMode="decimal"
              value={item.quantity}
              onChange={(event) => onChange(item.key, { quantity: event.target.value })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800" htmlFor={`price-${item.key}`}>
              Preço unitário
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-500">
                R$
              </span>
              <Input
                id={`price-${item.key}`}
                inputMode="decimal"
                value={item.unitPrice}
                onChange={(event) => onChange(item.key, { unitPrice: event.target.value })}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="text-sm text-ink-500">Total do item</span>
          <span className="text-base font-semibold text-ink-900">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
