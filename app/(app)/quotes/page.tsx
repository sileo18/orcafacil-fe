"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { quotesApi } from "@/lib/api/quotes";
import type { QuoteStatus } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api/client";

const PAGE_SIZE = 15;

export default function QuotesHistoryPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<QuoteStatus | "">("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const { data, error, isLoading, mutate } = useSWR(
    ["quotes", search, status, from, to, page],
    () =>
      quotesApi.list({
        search: search || undefined,
        status: status || undefined,
        from: from || undefined,
        to: to || undefined,
        page,
        pageSize: PAGE_SIZE,
      })
  );

  async function handleDuplicate(id: string) {
    setDuplicatingId(id);
    try {
      const duplicated = await quotesApi.duplicate(id);
      showSuccess("Orçamento duplicado como novo rascunho.");
      await mutate();
      router.push(`/quotes/${duplicated.id}/edit`);
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível duplicar o orçamento.");
    } finally {
      setDuplicatingId(null);
    }
  }

  function resetPageAnd<T>(setter: (value: T) => void, value: T) {
    setPage(1);
    setter(value);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Orçamentos</h1>
          <p className="mt-1 text-sm text-ink-500">Pesquise, filtre e reabra orçamentos anteriores.</p>
        </div>
        <LinkButton href="/quotes/new" size="lg" fullWidth className="sm:w-auto">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Novo orçamento
        </LinkButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <div className="relative sm:col-span-2">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden="true"
          />
          <Input
            placeholder="Buscar por cliente"
            value={search}
            onChange={(event) => resetPageAnd(setSearch, event.target.value)}
            className="pl-10"
            aria-label="Buscar por cliente"
          />
        </div>
        <Select
          aria-label="Filtrar por status"
          value={status}
          onChange={(event) => resetPageAnd(setStatus, event.target.value as QuoteStatus | "")}
        >
          <option value="">Todos os status</option>
          <option value="Draft">Rascunho</option>
          <option value="Sent">Enviado</option>
        </Select>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            aria-label="De"
            value={from}
            onChange={(event) => resetPageAnd(setFrom, event.target.value)}
          />
          <Input type="date" aria-label="Até" value={to} onChange={(event) => resetPageAnd(setTo, event.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando orçamentos..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          Não foi possível carregar os orçamentos. Tente novamente.
        </p>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="flex flex-col divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white dark:bg-ink-50">
            {data.items.map((quote) => (
              <div
                key={quote.id}
                className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <Link href={`/quotes/${quote.id}`} className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink-900">{quote.customerName}</p>
                  <p className="text-sm text-ink-500">{formatDate(quote.createdAt)}</p>
                </Link>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-semibold text-ink-900">{formatCurrency(quote.total)}</span>
                    <StatusBadge status={quote.status} />
                  </div>
                  <Button
                    variant="secondary"
                    size="md"
                    isLoading={duplicatingId === quote.id}
                    loadingText="Duplicando..."
                    onClick={() => handleDuplicate(quote.id)}
                  >
                    Duplicar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Anterior
            </Button>
            <p className="text-sm text-ink-500">
              Página {data.page} de {Math.max(1, data.totalPages)}
            </p>
            <Button
              variant="secondary"
              disabled={page >= data.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </>
      ) : (
        <EmptyState
          title="Nenhum orçamento encontrado."
          description="Tente ajustar os filtros ou crie um novo orçamento."
          action={<LinkButton href="/quotes/new">Novo orçamento</LinkButton>}
        />
      )}
    </div>
  );
}
