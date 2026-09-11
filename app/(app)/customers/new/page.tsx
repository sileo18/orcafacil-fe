"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { customersApi } from "@/lib/api/customers";
import { useToast } from "@/components/ui/Toast";
import type { CreateCustomerInput } from "@/lib/types";

export default function NewCustomerPage() {
  const router = useRouter();
  const { showSuccess } = useToast();

  async function handleSubmit(values: CreateCustomerInput) {
    const customer = await customersApi.create(values);
    showSuccess("Cliente salvo.");
    router.push(`/customers/${customer.id}`);
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link
        href="/customers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para clientes
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Novo cliente</h1>
        <p className="mt-1 text-sm text-ink-500">Só o nome é obrigatório — o resto você pode completar depois.</p>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <CustomerForm onSubmit={handleSubmit} submitLabel="Salvar cliente" submittingLabel="Salvando..." />
      </div>
    </div>
  );
}
