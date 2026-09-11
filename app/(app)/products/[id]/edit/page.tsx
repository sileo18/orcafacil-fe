"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/products/ProductForm";
import { productsApi } from "@/lib/api/products";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { useToast } from "@/components/ui/Toast";
import type { CreateProductInput } from "@/lib/types";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { showSuccess } = useToast();

  const { data, error, isLoading } = useSWR(id ? ["product", id] : null, () => productsApi.get(id));

  async function handleSubmit(values: CreateProductInput) {
    await productsApi.update(id, values);
    showSuccess("Produto atualizado.");
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
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Editar produto ou serviço</h1>
      </div>

      {isLoading ? (
        <FullScreenLoading label="Carregando produto..." />
      ) : error || !data ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">Não foi possível carregar este produto.</p>
      ) : (
        <div className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
          <ProductForm
            initialValues={data}
            onSubmit={handleSubmit}
            submitLabel="Salvar alterações"
            submittingLabel="Salvando..."
            onCancel={() => router.push("/products")}
          />
        </div>
      )}
    </div>
  );
}
