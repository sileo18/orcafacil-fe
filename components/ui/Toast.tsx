"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cx } from "@/lib/utils/cx";

interface ToastMessage {
  id: number;
  text: string;
  variant: "success" | "error";
}

interface ToastContextValue {
  showSuccess: (text: string) => void;
  showError: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let nextId = 1;

/**
 * Toda ação importante precisa deixar claro que funcionou
 * (PROMPT-MOBILEFIRST.md #14) — "✓ Orçamento salvo", nunca um silêncio
 * que deixa o usuário se perguntando "será que apertou?".
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = useCallback((text: string, variant: "success" | "error") => {
    const id = nextId++;
    setToasts((current) => [...current, { id, text, variant }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showSuccess = useCallback((text: string) => push(text, "success"), [push]);
  const showError = useCallback((text: string) => push(text, "error"), [push]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(
              "pointer-events-auto w-full max-w-sm rounded-lg border px-4 py-3 text-sm font-medium shadow-sm",
              toast.variant === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
            )}
          >
            {toast.variant === "success" ? "✓ " : ""}
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast precisa ser usado dentro de <ToastProvider>.");
  }
  return ctx;
}
