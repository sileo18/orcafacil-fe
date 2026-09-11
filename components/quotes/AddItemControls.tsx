"use client";

import { useState } from "react";
import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils/currency";
import type { Product } from "@/lib/types";

interface AddItemControlsProps {
  onAddProduct: (product: Product) => void;
  onAddFreeItem: () => void;
}

/**
 * Permite selecionar produto cadastrado ou adicionar item livre
 * (PROMPT-APP.md #18). Uma lista expansível simples em vez de um modal —
 * modais só quando realmente necessários (PROMPT-MOBILEFIRST.md #11).
 */
export function AddItemControls({ onAddProduct, onAddFreeItem }: AddItemControlsProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data } = useSWR(pickerOpen ? ["products-picker", search] : null, () =>
    productsApi.list({ search: search || undefined, isActive: true })
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="button" variant="secondary" fullWidth onClick={() => setPickerOpen((v) => !v)}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar produto cadastrado
        </Button>
        <Button type="button" variant="secondary" fullWidth onClick={onAddFreeItem}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Adicionar item livre
        </Button>
      </div>

      {pickerOpen ? (
        <div className="rounded-lg border border-ink-200 bg-ink-50 p-3">
          <div className="relative mb-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden="true"
            />
            <Input
              autoFocus
              placeholder="Buscar produto ou serviço"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="bg-white pl-9 dark:bg-ink-50"
              aria-label="Buscar produto ou serviço"
            />
          </div>
          <div className="flex max-h-56 flex-col divide-y divide-ink-200 overflow-y-auto rounded-lg border border-ink-200 bg-white dark:bg-ink-50">
            {data && data.length > 0 ? (
              data.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => {
                    onAddProduct(product);
                    setPickerOpen(false);
                    setSearch("");
                  }}
                  className="flex items-center justify-between gap-3 px-3 py-3 text-left hover:bg-ink-50"
                >
                  <span className="font-medium text-ink-900">{product.name}</span>
                  <span className="text-sm text-ink-500">{formatCurrency(product.unitPrice)}</span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-center text-sm text-ink-500">Nenhum produto ativo encontrado.</p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
