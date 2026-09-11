import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string | null;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/**
 * Label sempre explícito, nunca só placeholder (PROMPT-MOBILEFIRST.md #7).
 * Erro aparece junto ao campo (#13).
 */
export function FormField({ label, htmlFor, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink-800">
        {label}
        {required && <span className="text-red-600 dark:text-red-400"> *</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
