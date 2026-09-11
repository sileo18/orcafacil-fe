"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Pencil } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { useToast } from "@/components/ui/Toast";
import type { UpdateCustomerInput } from "@/lib/types";

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, error, isLoading, mutate } = useSWR(id ? ["customer", id] : null, () => customersApi.get(id));
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess } = useToast();

  async function handleUpdate(values: UpdateCustomerInput) {
    await customersApi.update(id, values);
    showSuccess("Cliente atualizado.");
    setIsEditing(false);
    await mutate();
  }

  if (isLoading) {
    return <FullScreenLoading label="Carregando cliente..." />;
  }

  if (error || !data) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
        Não foi possível carregar este cliente.
      </p>
    );
  }

  const { customer, recentQuotes } = data;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para clientes
      </Link>

      <div className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="truncate text-xl font-semibold text-ink-900">
            {isEditing ? "Editar cliente" : customer.name}
          </h1>
          {!isEditing ? (
            <Button variant="secondary" onClick={() => setIsEditing(true)}>
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Editar
            </Button>
          ) : null}
        </div>

        {isEditing ? (
          <CustomerForm
            initialValues={customer}
            onSubmit={handleUpdate}
            submitLabel="Salvar alterações"
            submittingLabel="Salvando..."
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <InfoRow label="Telefone" value={customer.phone} />
            <InfoRow label="E-mail" value={customer.email} />
            <InfoRow label="CPF/CNPJ" value={customer.document} />
            <InfoRow label="Endereço" value={customer.address} />
            {customer.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-ink-500">Observações</dt>
                <dd className="mt-0.5 whitespace-pre-wrap text-ink-900">{customer.notes}</dd>
              </div>
            ) : null}
          </dl>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-ink-900">Orçamentos recentes</h2>
        {recentQuotes.length > 0 ? (
          <div className="flex flex-col divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white dark:bg-ink-50">
            {recentQuotes.map((quote) => (
              <Link
                key={quote.id}
                href={`/quotes/${quote.id}`}
                className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-ink-50"
              >
                <p className="text-sm text-ink-500">{formatDate(quote.createdAt)}</p>
                <span className="font-medium text-ink-900">{formatCurrency(quote.total)}</span>
                <StatusBadge status={quote.status} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum orçamento para este cliente ainda." />
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-ink-900">{value || "—"}</dd>
    </div>
  );
}
