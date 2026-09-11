"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import useSWR from "swr";
import { businessApi } from "@/lib/api/business";
import { filesApi } from "@/lib/api/files";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FormField } from "@/components/ui/FormField";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/api/client";
import type { Business, UpdateBusinessInput } from "@/lib/types";

export default function BusinessSettingsPage() {
  const { data, error, isLoading, mutate } = useSWR("business", () => businessApi.get());
  const { showSuccess, showError } = useToast();

  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoVersion, setLogoVersion] = useState(0);

  async function handleLogoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    try {
      await filesApi.uploadLogo(file);
      showSuccess("Logo atualizada.");
      setLogoVersion((v) => v + 1);
      await mutate();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível enviar a imagem.");
    } finally {
      setIsUploadingLogo(false);
      event.target.value = "";
    }
  }

  if (isLoading) {
    return <FullScreenLoading label="Carregando dados da empresa..." />;
  }

  if (error || !data) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">Não foi possível carregar sua empresa.</p>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink-900">Empresa</h1>
        <p className="mt-1 text-sm text-ink-500">
          Esses dados aparecem no orçamento em PDF enviado aos seus clientes.
        </p>
      </div>

      <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <h2 className="mb-4 text-base font-semibold text-ink-900">Logo</h2>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-200 bg-ink-50">
            {data.hasLogo ? (
              // Imagem vem da nossa própria API — <img> simples evita a
              // complexidade de configurar next/image para um host dinâmico.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logoVersion}
                src={filesApi.logoUrl(data.updatedAt)}
                alt="Logo da empresa"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="px-1 text-center text-xs text-ink-400">Sem logo</span>
            )}
          </div>
          <div>
            <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border border-ink-300 bg-white px-4 text-sm font-medium text-ink-800 hover:bg-ink-50 dark:bg-ink-100">
              {isUploadingLogo ? "Enviando..." : "Enviar logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
                disabled={isUploadingLogo}
              />
            </label>
            <p className="mt-1.5 text-xs text-ink-500">PNG, JPEG ou WEBP, até 2 MB.</p>
          </div>
        </div>
      </section>

      <BusinessInfoForm business={data} onSaved={() => mutate()} />
    </div>
  );
}

function buildFormFromBusiness(business: Business): UpdateBusinessInput {
  return {
    name: business.name,
    legalName: business.legalName,
    document: business.document,
    phone: business.phone,
    email: business.email,
    address: business.address,
    city: business.city,
    state: business.state,
    zipCode: business.zipCode,
    primaryColor: business.primaryColor,
    secondaryColor: business.secondaryColor,
    footerText: business.footerText,
    defaultValidityDays: business.defaultValidityDays,
    pixKey: business.pixKey,
  };
}

interface BusinessInfoFormProps {
  business: Business;
  onSaved: () => Promise<unknown>;
}

/**
 * Componente próprio para o formulário: o estado local nasce a partir de
 * `business` no momento do mount (useState com inicializador), sem efeito
 * para "sincronizar" dados vindos de fora — evita o anti-padrão de usar
 * useEffect só para copiar props em estado.
 */
function BusinessInfoForm({ business, onSaved }: BusinessInfoFormProps) {
  const [form, setForm] = useState<UpdateBusinessInput>(() => buildFormFromBusiness(business));
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  function update<K extends keyof UpdateBusinessInput>(key: K, value: UpdateBusinessInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim()) {
      showError("Informe o nome da empresa.");
      return;
    }

    setIsSaving(true);
    try {
      await businessApi.update(form);
      showSuccess("Dados da empresa salvos.");
      await onSaved();
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível salvar.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <h2 className="mb-4 text-base font-semibold text-ink-900">Identidade</h2>
        <div className="flex flex-col gap-4">
          <FormField label="Nome da empresa" htmlFor="name" required>
            <Input id="name" value={form.name} onChange={(event) => update("name", event.target.value)} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Razão social (opcional)" htmlFor="legalName">
              <Input
                id="legalName"
                value={form.legalName ?? ""}
                onChange={(event) => update("legalName", event.target.value || null)}
              />
            </FormField>
            <FormField label="CNPJ/CPF (opcional)" htmlFor="document">
              <Input
                id="document"
                value={form.document ?? ""}
                onChange={(event) => update("document", event.target.value || null)}
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <h2 className="mb-4 text-base font-semibold text-ink-900">Contato</h2>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Telefone" htmlFor="phone">
              <Input
                id="phone"
                type="tel"
                value={form.phone ?? ""}
                onChange={(event) => update("phone", event.target.value || null)}
              />
            </FormField>
            <FormField label="E-mail" htmlFor="businessEmail">
              <Input
                id="businessEmail"
                type="email"
                value={form.email ?? ""}
                onChange={(event) => update("email", event.target.value || null)}
              />
            </FormField>
          </div>
          <FormField label="Endereço" htmlFor="address">
            <Input
              id="address"
              value={form.address ?? ""}
              onChange={(event) => update("address", event.target.value || null)}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Cidade" htmlFor="city">
              <Input id="city" value={form.city ?? ""} onChange={(event) => update("city", event.target.value || null)} />
            </FormField>
            <FormField label="Estado" htmlFor="state">
              <Input
                id="state"
                value={form.state ?? ""}
                onChange={(event) => update("state", event.target.value || null)}
                maxLength={2}
              />
            </FormField>
            <FormField label="CEP" htmlFor="zipCode">
              <Input
                id="zipCode"
                value={form.zipCode ?? ""}
                onChange={(event) => update("zipCode", event.target.value || null)}
              />
            </FormField>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <h2 className="mb-4 text-base font-semibold text-ink-900">Aparência do orçamento</h2>
        <FormField label="Cor principal" htmlFor="primaryColor" hint="Usada nos títulos e totais do PDF.">
          <div className="flex items-center gap-3">
            <input
              id="primaryColor"
              type="color"
              value={form.primaryColor ?? "#1F2937"}
              onChange={(event) => update("primaryColor", event.target.value)}
              className="h-12 w-16 shrink-0 cursor-pointer rounded-lg border border-ink-300"
            />
            <Input
              value={form.primaryColor ?? ""}
              onChange={(event) => update("primaryColor", event.target.value || null)}
              placeholder="#1F2937"
            />
          </div>
        </FormField>
      </section>

      <section className="rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50">
        <h2 className="mb-4 text-base font-semibold text-ink-900">Orçamento</h2>
        <div className="flex flex-col gap-4">
          <FormField
            label="Validade padrão (dias)"
            htmlFor="defaultValidityDays"
            required
            hint="Usada quando você não define uma validade específica no orçamento."
          >
            <Input
              id="defaultValidityDays"
              type="number"
              inputMode="numeric"
              min={1}
              value={form.defaultValidityDays}
              onChange={(event) => update("defaultValidityDays", Number(event.target.value) || 1)}
            />
          </FormField>
          <FormField label="Chave Pix (opcional)" htmlFor="pixKey">
            <Input id="pixKey" value={form.pixKey ?? ""} onChange={(event) => update("pixKey", event.target.value || null)} />
          </FormField>
          <FormField label="Rodapé do PDF (opcional)" htmlFor="footerText">
            <Textarea
              id="footerText"
              value={form.footerText ?? ""}
              onChange={(event) => update("footerText", event.target.value || null)}
              rows={2}
            />
          </FormField>
        </div>
      </section>

      <Button type="submit" size="lg" isLoading={isSaving} loadingText="Salvando...">
        Salvar alterações
      </Button>
    </form>
  );
}
