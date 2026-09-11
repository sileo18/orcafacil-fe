import { Spinner } from "./Spinner";

export function FullScreenLoading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-ink-500">
      <Spinner className="h-8 w-8" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
