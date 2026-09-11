"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft } from "lucide-react";
import { quotesApi } from "@/lib/api/quotes";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";

export default function EditQuotePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, error, isLoading } = useSWR(id ? ["quote", id] : null, () => quotesApi.get(id));

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/quotes/${id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para o orçamento
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Editar orçamento</h1>
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando orçamento..." />
      ) : error || !data ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">Não foi possível carregar este orçamento.</p>
      ) : (
        <QuoteBuilder mode="edit" quoteId={id} initialQuote={data} />
      )}
    </div>
  );
}
