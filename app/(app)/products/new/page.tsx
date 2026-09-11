"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";
import { productsApi } from "@/lib/api/products";
import { useToast } from "@/components/ui/Toast";
import type { CreateProductInput } from "@/lib/types";

export default function NewProductPage() {
  const router = useRouter();
  const { showSuccess } = useToast();

  async function handleSubmit(values: CreateProductInput) {
    await productsApi.create(values);
    showSuccess("Produto salvo.");
    router.push("/products");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para produtos
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Novo produto ou serviço</h1>
        <p className="mt-1 text-sm text-ink-500">Você poderá usá-lo em qualquer orçamento a partir de agora.</p>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <ProductForm onSubmit={handleSubmit} submitLabel="Salvar produto" submittingLabel="Salvando..." />
      </div>
    </div>
  );
}
