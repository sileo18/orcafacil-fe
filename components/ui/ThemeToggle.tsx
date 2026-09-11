"use client";

import { Moon, Sun } from "lucide-react";
import { cx } from "@/lib/utils/cx";
import { THEME_STORAGE_KEY } from "@/lib/utils/theme";

/**
 * Aplica o tema no <html> + persiste em localStorage. Fica fora do
 * componente para poder ser chamada tanto pelo clique quanto (se
 * necessário no futuro) por outro gatilho, sem duplicar lógica.
 */
function setTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
  } catch {
    // localStorage pode falhar em modo privado/restrito — o tema ainda
    // funciona na sessão atual, só não persiste. Não é motivo pra quebrar.
  }
}

/**
 * Botão de alternar claro/escuro. Não usa useState para decidir qual ícone
 * mostrar — os dois ícones são sempre renderizados e o CSS (`dark:hidden`
 * / `dark:block`) decide qual aparece. Isso evita mismatch de hidratação:
 * o script inline em app/layout.tsx já aplica a classe `dark` no <html>
 * antes do React hidratar, então o HTML do servidor (sempre "sem dark") e
 * o HTML real do navegador (que pode já ter "dark") não precisam bater —
 * é só CSS decidindo visibilidade, não uma decisão de render do React.
 */
export function ThemeToggle({ className }: { className?: string }) {
  function handleClick() {
    const isDark = !document.documentElement.classList.contains("dark");
    setTheme(isDark);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema claro/escuro"
      className={cx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900",
        className
      )}
    >
      <Sun className="h-5 w-5 dark:hidden" aria-hidden="true" />
      <Moon className="hidden h-5 w-5 dark:block" aria-hidden="true" />
    </button>
  );
}
