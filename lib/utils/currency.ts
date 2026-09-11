const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

/** Formata para o padrão "R$ 1.234,56" (PROMPT-APP.md #9). */
export function formatCurrency(value: number | null | undefined): string {
  return currencyFormatter.format(value ?? 0);
}

const numberFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 });

export function formatQuantity(value: number): string {
  return numberFormatter.format(value);
}

/** Aceita "1.234,56", "1234.56" ou "1234,56" digitados pelo usuário. */
export function parseLocaleNumber(value: string): number {
  if (!value) return 0;
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
