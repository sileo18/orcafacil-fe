import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { cx } from "@/lib/utils/cx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, hasError, rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx(
        "w-full rounded-lg border bg-white px-3.5 py-3 text-base text-ink-900 placeholder:text-ink-400 dark:bg-ink-50",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:focus-visible:outline-brand-400",
        "disabled:bg-ink-50 disabled:text-ink-400",
        hasError ? "border-red-400 dark:border-red-500" : "border-ink-300",
        className
      )}
      {...props}
    />
  );
});
