import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-ink-300 bg-white px-6 py-14 text-center dark:bg-ink-50">
      <p className="text-base font-medium text-ink-800">{title}</p>
      {description ? <p className="max-w-sm text-sm text-ink-500">{description}</p> : null}
      {action}
    </div>
  );
}
