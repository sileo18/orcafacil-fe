import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, hasError, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={cx(
        "h-12 w-full rounded-lg border bg-white px-3.5 text-base text-ink-900 dark:bg-ink-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:focus-visible:outline-brand-400",
        "disabled:bg-ink-50 disabled:text-ink-400",
        hasError ? "border-red-400 dark:border-red-500" : "border-ink-300",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
