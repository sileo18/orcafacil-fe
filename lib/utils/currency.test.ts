import { describe, expect, it } from "vitest";
import { formatCurrency, parseLocaleNumber, round2 } from "./currency";

// Intl.NumberFormat("pt-BR") insere um espaço fino/non-breaking entre "R$"
// e o número — normalizamos para comparar com um espaço comum no teste.
function normalizeSpaces(value: string): string {
  return value.replace(/[\u00a0\u202f]/g, " ");
}

describe("formatCurrency", () => {
  it("formats using the pt-BR pattern 'R$ 1.234,56'", () => {
    expect(normalizeSpaces(formatCurrency(1234.56))).toBe("R$ 1.234,56");
  });

  it("treats null/undefined as zero", () => {
    expect(normalizeSpaces(formatCurrency(null))).toBe("R$ 0,00");
    expect(normalizeSpaces(formatCurrency(undefined))).toBe("R$ 0,00");
  });
});

describe("parseLocaleNumber", () => {
  it("parses a comma as the decimal separator", () => {
    expect(parseLocaleNumber("1,5")).toBe(1.5);
  });

  it("parses a plain integer string", () => {
    expect(parseLocaleNumber("42")).toBe(42);
  });

  it("returns 0 for empty or invalid input", () => {
    expect(parseLocaleNumber("")).toBe(0);
    expect(parseLocaleNumber("abc")).toBe(0);
  });
});

describe("round2", () => {
  it("rounds to two decimal places", () => {
    expect(round2(10.005)).toBeCloseTo(10.01, 2);
    expect(round2(10.004)).toBeCloseTo(10, 2);
  });
});
