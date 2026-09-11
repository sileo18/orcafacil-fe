import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <ThemeToggle className="absolute right-4 top-4" />
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-2xl font-semibold tracking-tight text-ink-900">Orçamento Fácil</p>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8 dark:bg-ink-50">
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
