import type { HTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx("rounded-xl border border-ink-200 bg-white p-4 sm:p-6 dark:bg-ink-50", className)}
      {...props}
    />
  );
}
