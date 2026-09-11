"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Plus, LogOut } from "lucide-react";
import { navItems } from "./nav-items";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cx } from "@/lib/utils/cx";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-200 bg-white md:flex dark:bg-ink-50">
      <div className="flex items-start justify-between px-5 py-6">
        <div className="min-w-0">
          <p className="text-lg font-semibold tracking-tight text-ink-900">Orçamento Fácil</p>
          <p className="mt-0.5 truncate text-sm text-ink-500">{user?.businessName}</p>
        </div>
        <ThemeToggle className="-mr-1.5 -mt-1" />
      </div>

      <div className="px-4">
        <Link
          href="/quotes/new"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-600 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo orçamento
        </Link>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3" aria-label="Navegação principal">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cx(
                "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                active ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              )}
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-ink-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900"
        >
          <LogOut className="h-[18px] w-[18px]" aria-hidden="true" />
          Sair
        </button>
      </div>
    </aside>
  );
}
