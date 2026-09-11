"use client";

import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 disabled:bg-ink-300",
  secondary: "bg-white text-ink-800 border border-ink-300 hover:bg-ink-50 disabled:text-ink-400 dark:bg-ink-100",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100 disabled:text-ink-300",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 dark:disabled:bg-red-900 dark:disabled:text-red-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-14 px-6 text-base gap-2.5",
};

/**
 * Classes de botão reutilizáveis fora de um <button> real — por exemplo em
 * um <Link> estilizado como botão. Evita aninhar <button> dentro de <a>
 * (inválido em HTML e ruim para acessibilidade).
 */
export function buttonClassNames(options: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}): string {
  const { variant = "primary", size = "md", fullWidth = false, className } = options;
  return cx(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors select-none",
    "disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className
  );
}

/**
 * Botão com texto sempre explícito (PROMPT-MOBILEFIRST.md #8) e estado de
 * loading com legenda específica da ação (#15) — nunca só um spinner.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    loadingText,
    fullWidth = false,
    className,
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClassNames({ variant, size, fullWidth, className })}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner className="h-4 w-4 shrink-0" />
          <span>{loadingText ?? "Carregando..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});
