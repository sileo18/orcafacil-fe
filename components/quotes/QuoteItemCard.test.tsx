import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuoteItemCard, type DraftItem } from "./QuoteItemCard";

function buildItem(overrides: Partial<DraftItem> = {}): DraftItem {
  return {
    key: "item-1",
    productId: null,
    description: "Corte de cabelo",
    quantity: "2",
    unitPrice: "50",
    ...overrides,
  };
}

describe("QuoteItemCard", () => {
  it("shows the computed total for quantity × preço unitário", () => {
    render(<QuoteItemCard item={buildItem()} index={0} onChange={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByText("R$ 100,00")).toBeInTheDocument();
  });

  it("calls onChange when the description is edited", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<QuoteItemCard item={buildItem({ description: "" })} index={0} onChange={onChange} onRemove={vi.fn()} />);

    await user.type(screen.getByLabelText("Descrição"), "Barba");

    expect(onChange).toHaveBeenCalled();
  });

  it("calls onRemove with the item key when removed", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(<QuoteItemCard item={buildItem()} index={0} onChange={vi.fn()} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: /remover item 1/i }));

    expect(onRemove).toHaveBeenCalledWith("item-1");
  });

  it("treats an empty price as zero in the total", () => {
    render(<QuoteItemCard item={buildItem({ unitPrice: "" })} index={0} onChange={vi.fn()} onRemove={vi.fn()} />);

    expect(screen.getByText("R$ 0,00")).toBeInTheDocument();
  });
});
