"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { QuoteBuilder } from "@/components/quotes/QuoteBuilder";

export default function NewQuotePage() {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para orçamentos
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Novo orçamento</h1>
        <p className="mt-1 text-sm text-ink-500">Escolha o cliente, adicione os itens e gere o orçamento.</p>
      </div>

      <QuoteBuilder mode="create" />
    </div>
  );
}
