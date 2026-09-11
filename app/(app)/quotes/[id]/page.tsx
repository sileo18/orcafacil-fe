"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Download, MessageCircle, Pencil, Copy } from "lucide-react";
import { quotesApi } from "@/lib/api/quotes";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { buildQuoteWhatsAppMessage, buildWhatsAppShareUrl, firstName } from "@/lib/utils/whatsapp";

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "orcamento";
}

export default function QuoteDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const { data, error, isLoading, mutate } = useSWR(id ? ["quote", id] : null, () => quotesApi.get(id));

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  async function downloadPdf(customerName: string): Promise<boolean> {
    try {
      const blob = await quotesApi.downloadPdf(id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orcamento-${slugify(customerName)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível gerar o PDF. Tente novamente.");
      return false;
    }
  }

  async function handleDownload() {
    if (!data) return;
    setIsDownloading(true);
    const ok = await downloadPdf(data.customerName);
    if (ok) showSuccess("PDF gerado.");
    setIsDownloading(false);
  }

  async function handleShareWhatsApp() {
    if (!data) return;
    setIsSharing(true);
    try {
      const updated = await quotesApi.markAsSent(id);
      await mutate(updated, { revalidate: false });

      // PDF já baixado, pronto para o usuário anexar manualmente no
      // WhatsApp — não fazemos upload automático (PROMPT-APP.md #23).
      await downloadPdf(data.customerName);

      const message = buildQuoteWhatsAppMessage({
        customerFirstName: firstName(data.customerName),
        businessName: user?.businessName ?? "nossa empresa",
        totalFormatted: formatCurrency(data.total),
      });
      const url = buildWhatsAppShareUrl(data.customerPhone, message);
      window.open(url, "_blank", "noopener,noreferrer");

      showSuccess("Orçamento pronto para enviar no WhatsApp.");
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível preparar o compartilhamento.");
    } finally {
      setIsSharing(false);
    }
  }

  async function handleDuplicate() {
    setIsDuplicating(true);
    try {
      const duplicated = await quotesApi.duplicate(id);
      showSuccess("Orçamento duplicado como novo rascunho.");
      router.push(`/quotes/${duplicated.id}/edit`);
    } catch (err) {
      showError(err instanceof ApiError ? err.message : "Não foi possível duplicar o orçamento.");
    } finally {
      setIsDuplicating(false);
    }
  }

  if (isLoading) {
    return <FullScreenLoading label="Carregando orçamento..." />;
  }

  if (error || !data) {
    return (
      <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">Não foi possível carregar este orçamento.</p>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 pb-8">
      <Link
        href="/quotes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Voltar para orçamentos
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900">{data.customerName}</h1>
            <StatusBadge status={data.status} />
          </div>
          <p className="text-sm text-ink-500">
            Criado em {formatDate(data.createdAt)} · Válido por {data.validityDays} dias
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink-400">Total</p>
          <p className="text-2xl font-semibold text-brand-700 dark:text-brand-400">{formatCurrency(data.total)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap">
        <LinkButton href={`/quotes/${id}/edit`} variant="secondary" fullWidth className="sm:w-auto">
          <Pencil className="h-4 w-4" aria-hidden="true" />
          Editar
        </LinkButton>
        <Button
          variant="secondary"
          fullWidth
          className="sm:w-auto"
          onClick={handleDownload}
          isLoading={isDownloading}
          loadingText="Gerando PDF..."
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Baixar PDF
        </Button>
        <Button
          fullWidth
          className="col-span-2 sm:w-auto"
          onClick={handleShareWhatsApp}
          isLoading={isSharing}
          loadingText="Preparando..."
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          Compartilhar WhatsApp
        </Button>
        <Button
          variant="secondary"
          fullWidth
          className="col-span-2 sm:w-auto"
          onClick={handleDuplicate}
          isLoading={isDuplicating}
          loadingText="Duplicando..."
        >
          <Copy className="h-4 w-4" aria-hidden="true" />
          Duplicar orçamento
        </Button>
      </div>

      <div>
        <h2 className="mb-3 text-base font-semibold text-ink-900">Prévia</h2>
        <div className="overflow-hidden rounded-xl border border-ink-200 bg-ink-100">
          <iframe
            key={id}
            src={quotesApi.previewUrl(id)}
            title="Prévia do orçamento"
            className="h-[70vh] w-full bg-white sm:h-[80vh]"
          />
        </div>
      </div>
    </div>
  );
}
