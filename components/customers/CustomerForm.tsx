"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import type { CreateCustomerInput } from "@/lib/types";

interface CustomerFormProps {
  initialValues?: Partial<CreateCustomerInput>;
  onSubmit: (values: CreateCustomerInput) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
  onCancel?: () => void;
}

/** Fluxo mínimo: só o nome é obrigatório (PROMPT-MOBILEFIRST.md #19). */
export function CustomerForm({ initialValues, onSubmit, submitLabel, submittingLabel, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [document, setDocument] = useState(initialValues?.document ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [notes, setNotes] = useState(initialValues?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        document: document?.trim() || null,
        address: address?.trim() || null,
        notes: notes?.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar o cliente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <FormField label="Nome" htmlFor="customer-name" required>
        <Input
          id="customer-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="João da Silva"
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Telefone" htmlFor="customer-phone">
          <Input
            id="customer-phone"
            type="tel"
            inputMode="tel"
            value={phone ?? ""}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="(11) 99999-0000"
          />
        </FormField>
        <FormField label="E-mail (opcional)" htmlFor="customer-email">
          <Input
            id="customer-email"
            type="email"
            inputMode="email"
            value={email ?? ""}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="cliente@email.com"
          />
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="CPF/CNPJ (opcional)" htmlFor="customer-document">
          <Input id="customer-document" value={document ?? ""} onChange={(event) => setDocument(event.target.value)} />
        </FormField>
        <FormField label="Endereço (opcional)" htmlFor="customer-address">
          <Input id="customer-address" value={address ?? ""} onChange={(event) => setAddress(event.target.value)} />
        </FormField>
      </div>

      <FormField label="Observações (opcional)" htmlFor="customer-notes">
        <Textarea id="customer-notes" value={notes ?? ""} onChange={(event) => setNotes(event.target.value)} rows={3} />
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
