import { parseLocaleNumber, round2 } from "@/lib/utils/currency";
import type { DiscountType } from "@/lib/types";

export interface QuoteCalcItemInput {
  quantity: string;
  unitPrice: string;
}

export interface QuoteCalculationResult {
  itemTotals: number[];
  subtotal: number;
  discountAmount: number;
  discountValue: number;
  feesValue: number;
  total: number;
}

/**
 * Espelha o QuoteCalculator do backend (Domain/Calculations) para dar
 * feedback instantâneo enquanto o usuário digita. É só uma prévia — o
 * backend sempre recalcula e é a fonte de verdade (PROMPT-APP.md #10).
 */
export function calculateQuotePreview(
  items: QuoteCalcItemInput[],
  discountType: DiscountType,
  discountInput: string,
  additionalFees: string
): QuoteCalculationResult {
  const parsedItems = items.map((item) => ({
    quantity: parseLocaleNumber(item.quantity),
    unitPrice: parseLocaleNumber(item.unitPrice),
  }));

  const itemTotals = parsedItems.map((item) => round2(item.quantity * item.unitPrice));
  const subtotal = round2(itemTotals.reduce((sum, value) => sum + value, 0));
  const discountValue = parseLocaleNumber(discountInput);
  const feesValue = parseLocaleNumber(additionalFees);

  const discountAmount =
    discountType === "Percentage" ? round2((subtotal * discountValue) / 100) : round2(discountValue);

  const total = Math.max(0, round2(subtotal - discountAmount + feesValue));

  return { itemTotals, subtotal, discountAmount, discountValue, feesValue, total };
}

export interface QuoteValidationItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

/**
 * Previne o erro antes de enviar ao backend (PROMPT-MOBILEFIRST.md #16),
 * com as mesmas mensagens usadas no backend para consistência.
 */
export function validateQuoteDraft(params: {
  hasCustomer: boolean;
  items: QuoteValidationItem[];
  discountType: DiscountType;
  calculation: QuoteCalculationResult;
}): string | null {
  const { hasCustomer, items, discountType, calculation } = params;

  if (!hasCustomer) return "Selecione ou cadastre um cliente para continuar.";
  if (items.length === 0) return "Adicione ao menos um item ao orçamento.";
  if (items.some((item) => !item.description.trim())) return "Informe a descrição de todos os itens.";
  if (items.some((item) => parseLocaleNumber(item.quantity) <= 0)) {
    return "A quantidade de cada item deve ser maior que zero.";
  }
  if (items.some((item) => parseLocaleNumber(item.unitPrice) < 0)) return "O preço unitário não pode ser negativo.";
  if (calculation.discountValue < 0) return "O desconto não pode ser negativo.";
  if (discountType === "Percentage" && calculation.discountValue > 100) {
    return "O desconto percentual não pode ser maior que 100%.";
  }
  if (calculation.discountAmount > calculation.subtotal) return "O desconto não pode ser maior que o subtotal.";
  if (calculation.feesValue < 0) return "Frete/taxas não pode ser negativo.";
  return null;
}
