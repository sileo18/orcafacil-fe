"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormField } from "@/components/ui/FormField";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await authApi.login({ email: email.trim(), password });
      setUser(user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Entrar" subtitle="Acesse sua conta para criar orçamentos.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="voce@empresa.com"
          />
        </FormField>

        <FormField label="Senha" htmlFor="password" required>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Entrando...">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Ainda não tem uma conta?{" "}
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          Criar conta
        </Link>
      </p>
    </AuthCard>
  );
}
