"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import type { CreateProductInput } from "@/lib/types";

interface ProductFormProps {
  initialValues?: Partial<CreateProductInput>;
  onSubmit: (values: CreateProductInput) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  onCancel?: () => void;
}

export function ProductForm({ initialValues, onSubmit, submitLabel, submittingLabel, onCancel }: ProductFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [unitPrice, setUnitPrice] = useState(
    initialValues?.unitPrice !== undefined ? String(initialValues.unitPrice) : ""
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const price = Number(unitPrice.replace(",", "."));

    if (!name.trim()) {
      setError("Informe o nome do produto ou serviço.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError("Informe um preço válido.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), description: description?.trim() || null, unitPrice: price });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <FormField label="Nome" htmlFor="product-name" required>
        <Input
          id="product-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Ex: Corte de cabelo"
        />
      </FormField>

      <FormField label="Preço" htmlFor="product-price" required hint="Use vírgula ou ponto para os centavos.">
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500">R$</span>
          <Input
            id="product-price"
            inputMode="decimal"
            value={unitPrice}
            onChange={(event) => setUnitPrice(event.target.value)}
            placeholder="0,00"
            className="pl-10"
          />
        </div>
      </FormField>

      <FormField label="Descrição (opcional)" htmlFor="product-description">
        <Textarea
          id="product-description"
          value={description ?? ""}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
      </FormField>

      {error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText={submittingLabel}
          size="lg"
          fullWidth={!onCancel}
          className="sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
