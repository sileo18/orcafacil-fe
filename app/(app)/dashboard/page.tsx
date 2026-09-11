"use client";

import Link from "next/link";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { quotesApi } from "@/lib/api/quotes";
import { LinkButton } from "@/components/ui/LinkButton";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("dashboard", () => quotesApi.dashboard());

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Orçamentos</h1>
          <p className="mt-1 text-sm text-ink-500">Crie um novo orçamento ou continue de onde parou.</p>
        </div>
        <LinkButton href="/quotes/new" size="lg" fullWidth className="sm:w-auto">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Novo orçamento
        </LinkButton>
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando seus orçamentos..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          Não foi possível carregar o painel. Tente novamente.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard label="Orçamentos" value={data?.totalQuotes ?? 0} />
            <SummaryCard label="Rascunhos" value={data?.draftCount ?? 0} />
            <SummaryCard label="Enviados" value={data?.sentCount ?? 0} />
          </div>

          <div>
            <h2 className="mb-3 text-base font-semibold text-ink-900">Recentes</h2>
            {data && data.recent.length > 0 ? (
              <div className="flex flex-col divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white dark:bg-ink-50">
                {data.recent.map((quote) => (
                  <Link
                    key={quote.id}
                    href={`/quotes/${quote.id}`}
                    className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-ink-50 sm:px-5"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink-900">{quote.customerName}</p>
                      <p className="text-sm text-ink-500">{formatDate(quote.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className="font-semibold text-ink-900">{formatCurrency(quote.total)}</span>
                      <StatusBadge status={quote.status} />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Você ainda não criou nenhum orçamento."
                description="Comece agora — leva menos de um minuto."
                action={<LinkButton href="/quotes/new">Novo orçamento</LinkButton>}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="p-4 text-center sm:p-5">
      <p className="text-2xl font-semibold text-ink-900">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{label}</p>
    </Card>
  );
}
