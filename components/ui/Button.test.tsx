import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the provided label", () => {
    render(<Button>Gerar orçamento</Button>);
    expect(screen.getByRole("button", { name: "Gerar orçamento" })).toBeInTheDocument();
  });

  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Salvar</Button>);
    await user.click(screen.getByRole("button", { name: "Salvar" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows an action-specific loading label and disables the button (evita duplo clique)", () => {
    render(
      <Button isLoading loadingText="Gerando orçamento...">
        Gerar orçamento
      </Button>
    );

    const button = screen.getByRole("button", { name: "Gerando orçamento..." });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
  });
});
