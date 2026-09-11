"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, LogOut } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function MobileTopBar() {
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-ink-200 bg-white px-4 md:hidden dark:bg-ink-50">
      <p className="text-base font-semibold tracking-tight text-ink-900">Orçamento Fácil</p>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link
          href="/business"
          aria-label="Empresa"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50"
        >
          <Building2 className="h-5 w-5" aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sair"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-500 hover:bg-ink-50"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
