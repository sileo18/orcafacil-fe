"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mobileNavItems } from "./nav-items";
import { cx } from "@/lib/utils/cx";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink-200 bg-white dark:bg-ink-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Navegação principal"
    >
      {mobileNavItems.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium",
              active ? "text-brand-700" : "text-ink-500"
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
