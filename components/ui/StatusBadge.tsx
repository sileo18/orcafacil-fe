import type { QuoteStatus } from "@/lib/types";
import { cx } from "@/lib/utils/cx";

const labels: Record<QuoteStatus, string> = {
  Draft: "Rascunho",
  Sent: "Enviado",
};

const classes: Record<QuoteStatus, string> = {
  Draft: "bg-ink-100 text-ink-700 border-ink-200",
  Sent: "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        classes[status]
      )}
    >
      {labels[status]}
    </span>
  );
}
