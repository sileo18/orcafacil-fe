"use client";

import { useState } from "react";
import useSWR from "swr";
import { Search, UserPlus, Check } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CustomerForm } from "@/components/customers/CustomerForm";
import type { CreateCustomerInput } from "@/lib/types";

interface CustomerPickerProps {
  selectedId: string | null;
  selectedName: string | null;
  onSelect: (customer: { id: string; name: string }) => void;
}

/**
 * Buscar cliente existente ou cadastrar um novo sem sair da tela
 * (PROMPT-MOBILEFIRST.md #18-19) — não exige digitar de novo informações
 * que já existem no cadastro.
 */
export function CustomerPicker({ selectedId, selectedName, onSelect }: CustomerPickerProps) {
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const { data } = useSWR(["customers-picker", search], () => customersApi.list(search || undefined));

  async function handleCreate(values: CreateCustomerInput) {
    const customer = await customersApi.create(values);
    onSelect({ id: customer.id, name: customer.name });
    setCreating(false);
  }

  if (selectedId && !creating) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2">
          <Check className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
          <span className="truncate font-medium text-ink-900">{selectedName}</span>
        </div>
        <Button type="button" variant="ghost" size="md" onClick={() => onSelect({ id: "", name: "" })}>
          Trocar
        </Button>
      </div>
    );
  }

  if (creating) {
    return (
      <div className="rounded-lg border border-ink-200 bg-ink-50 p-4">
        <p className="mb-3 text-sm font-medium text-ink-800">Novo cliente</p>
        <CustomerForm
          onSubmit={handleCreate}
          submitLabel="Salvar cliente"
          submittingLabel="Salvando..."
          onCancel={() => setCreating(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <Input
          placeholder="Buscar cliente pelo nome"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
          aria-label="Buscar cliente"
        />
      </div>

      <div className="flex max-h-64 flex-col divide-y divide-ink-100 overflow-y-auto rounded-lg border border-ink-200 bg-white dark:bg-ink-50">
        {data && data.length > 0 ? (
          data.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => onSelect({ id: customer.id, name: customer.name })}
              className="flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-ink-50"
            >
              <span className="font-medium text-ink-900">{customer.name}</span>
              <span className="text-sm text-ink-500">{customer.phone ?? ""}</span>
            </button>
          ))
        ) : (
          <p className="px-4 py-4 text-center text-sm text-ink-500">Nenhum cliente encontrado.</p>
        )}
      </div>

      <Button type="button" variant="secondary" fullWidth onClick={() => setCreating(true)}>
        <UserPlus className="h-4 w-4" aria-hidden="true" />
        Novo cliente
      </Button>
    </div>
  );
}
