"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { Plus, Search } from "lucide-react";
import { customersApi } from "@/lib/api/customers";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR(["customers", search], () => customersApi.list(search || undefined));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Clientes</h1>
          <p className="mt-1 text-sm text-ink-500">Cadastre e encontre seus clientes rapidamente.</p>
        </div>
        <LinkButton href="/customers/new" size="lg" fullWidth className="sm:w-auto">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Novo cliente
        </LinkButton>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <Input
          placeholder="Buscar por nome ou telefone"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-10"
          aria-label="Buscar cliente"
        />
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando clientes..." />
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          Não foi possível carregar os clientes. Tente novamente.
        </p>
      ) : data && data.length > 0 ? (
        <div className="flex flex-col divide-y divide-ink-100 rounded-xl border border-ink-200 bg-white dark:bg-ink-50">
          {data.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-ink-50 sm:px-5"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-900">{customer.name}</p>
                <p className="truncate text-sm text-ink-500">{customer.phone ?? customer.email ?? "Sem contato cadastrado"}</p>
              </div>
              <span className="shrink-0 text-sm text-ink-500">
                {customer.quotesCount} {customer.quotesCount === 1 ? "orçamento" : "orçamentos"}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title={search ? "Nenhum cliente encontrado." : "Você ainda não cadastrou nenhum cliente."}
          description={search ? "Tente outro termo de busca." : "Cadastre seu primeiro cliente para começar."}
          action={<LinkButton href="/customers/new">Novo cliente</LinkButton>}
        />
      )}
    </div>
  );
}
