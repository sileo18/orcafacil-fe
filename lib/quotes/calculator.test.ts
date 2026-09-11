import { describe, expect, it } from "vitest";
import { calculateQuotePreview, validateQuoteDraft } from "./calculator";

describe("calculateQuotePreview", () => {
  it("computes subtotal and total for a single item", () => {
    const result = calculateQuotePreview([{ quantity: "2", unitPrice: "100" }], "Percentage", "0", "0");

    expect(result.subtotal).toBe(200);
    expect(result.total).toBe(200);
    expect(result.itemTotals).toEqual([200]);
  });

  it("sums multiple items correctly", () => {
    const result = calculateQuotePreview(
      [
        { quantity: "1", unitPrice: "100" },
        { quantity: "3", unitPrice: "50" },
      ],
      "Percentage",
      "0",
      "0"
    );

    expect(result.subtotal).toBe(250);
  });

  it("accepts decimal quantities typed with comma (pt-BR)", () => {
    const result = calculateQuotePreview([{ quantity: "1,5", unitPrice: "100" }], "Percentage", "0", "0");

    expect(result.subtotal).toBe(150);
  });

  it("applies a percentage discount over the subtotal", () => {
    const result = calculateQuotePreview([{ quantity: "1", unitPrice: "200" }], "Percentage", "10", "0");

    expect(result.discountAmount).toBe(20);
    expect(result.total).toBe(180);
  });

  it("applies a fixed amount discount", () => {
    const result = calculateQuotePreview([{ quantity: "1", unitPrice: "200" }], "FixedAmount", "30", "0");

    expect(result.discountAmount).toBe(30);
    expect(result.total).toBe(170);
  });

  it("adds additional fees (frete/taxas) on top of the discounted subtotal", () => {
    const result = calculateQuotePreview([{ quantity: "1", unitPrice: "200" }], "FixedAmount", "30", "15");

    expect(result.total).toBe(185); // 200 - 30 + 15
  });

  it("never returns a negative total", () => {
    const result = calculateQuotePreview([{ quantity: "1", unitPrice: "100" }], "FixedAmount", "100", "0");

    expect(result.total).toBe(0);
  });

  it("treats an empty discount input as zero", () => {
    const result = calculateQuotePreview([{ quantity: "1", unitPrice: "100" }], "Percentage", "", "");

    expect(result.discountAmount).toBe(0);
    expect(result.total).toBe(100);
  });
});

describe("validateQuoteDraft", () => {
  const baseCalculation = calculateQuotePreview([{ quantity: "1", unitPrice: "100" }], "Percentage", "0", "0");

  it("requires a customer to be selected", () => {
    const error = validateQuoteDraft({
      hasCustomer: false,
      items: [{ description: "Item", quantity: "1", unitPrice: "100" }],
      discountType: "Percentage",
      calculation: baseCalculation,
    });

    expect(error).toMatch(/cliente/i);
  });

  it("requires at least one item", () => {
    const error = validateQuoteDraft({
      hasCustomer: true,
      items: [],
      discountType: "Percentage",
      calculation: calculateQuotePreview([], "Percentage", "0", "0"),
    });

    expect(error).toMatch(/item/i);
  });

  it("requires a description on every item", () => {
    const error = validateQuoteDraft({
      hasCustomer: true,
      items: [{ description: "   ", quantity: "1", unitPrice: "100" }],
      discountType: "Percentage",
      calculation: baseCalculation,
    });

    expect(error).toMatch(/descrição/i);
  });

  it("rejects a discount greater than the subtotal", () => {
    const calculation = calculateQuotePreview([{ quantity: "1", unitPrice: "100" }], "FixedAmount", "150", "0");

    const error = validateQuoteDraft({
      hasCustomer: true,
      items: [{ description: "Item", quantity: "1", unitPrice: "100" }],
      discountType: "FixedAmount",
      calculation,
    });

    expect(error).toMatch(/desconto.*subtotal/i);
  });

  it("rejects a percentage discount above 100%", () => {
    const calculation = calculateQuotePreview([{ quantity: "1", unitPrice: "100" }], "Percentage", "150", "0");

    const error = validateQuoteDraft({
      hasCustomer: true,
      items: [{ description: "Item", quantity: "1", unitPrice: "100" }],
      discountType: "Percentage",
      calculation,
    });

    expect(error).toMatch(/100%/);
  });

  it("returns null when everything is valid", () => {
    const error = validateQuoteDraft({
      hasCustomer: true,
      items: [{ description: "Item", quantity: "1", unitPrice: "100" }],
      discountType: "Percentage",
      calculation: baseCalculation,
    });

    expect(error).toBeNull();
  });
});
