"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Plus, Search, Pencil } from "lucide-react";
import { productsApi } from "@/lib/api/products";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/currency";
import { cx } from "@/lib/utils/cx";

type ActiveFilter = "active" | "inactive" | "all";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ActiveFilter>("active");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const isActiveParam = filter === "all" ? undefined : filter === "active";

  const { data, error, isLoading, mutate } = useSWR(["products", search, filter], () =>
    productsApi.list({ search: search || undefined, isActive: isActiveParam })
  );

  async function handleToggleActive(id: string, nextActive: boolean) {
    setTogglingId(id);
    try {
      await productsApi.setActive(id, nextActive);
      showSuccess(nextActive ? "Produto ativado." : "Produto desativado.");
      await mutate();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível atualizar o produto.");
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Produtos e serviços</h1>
          <p className="mt-1 text-sm text-ink-500">Cadastre o que você vende para usar nos orçamentos.</p>
        </div>
        <LinkButton href="/products/new" size="lg" fullWidth className="sm:w-auto">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Novo produto
        </LinkButton>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar produto ou serviço"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
            aria-label="Buscar produto"
          />
        </div>

        <div className="inline-flex rounded-lg border border-ink-300 bg-white p-1 dark:bg-ink-50" role="tablist" aria-label="Filtrar por status">
          {(
            [
              ["active", "Ativos"],
              ["inactive", "Inativos"],
              ["all", "Todos"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={filter === value}
              onClick={() => setFilter(value)}
              className={cx(
                "h-9 rounded-md px-3 text-sm font-medium transition-colors",
                filter === value ? "bg-brand-600 text-white" : "text-ink-600 hover:bg-ink-50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando produtos..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          Não foi possível carregar os produtos. Tente novamente.
        </p>
      ) : data && data.length > 0 ? (
        <div className="flex flex-col divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white dark:bg-ink-50">
          {data.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <div className="min-w-0">
                <p className={cx("truncate font-medium", product.isActive ? "text-ink-900" : "text-ink-400")}>
                  {product.name}
                </p>
                <p className="text-sm text-ink-500">{formatCurrency(product.unitPrice)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50"
                  aria-label={`Editar ${product.name}`}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Button
                  variant="secondary"
                  size="md"
                  isLoading={togglingId === product.id}
                  loadingText="Aguarde..."
                  onClick={() => handleToggleActive(product.id, !product.isActive)}
                >
                  {product.isActive ? "Desativar" : "Ativar"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum produto encontrado."
          description="Cadastre seus produtos e serviços para adicioná-los rapidamente aos orçamentos."
          action={<LinkButton href="/products/new">Novo produto</LinkButton>}
        />
      )}
    </div>
  );
}
