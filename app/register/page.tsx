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

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }

    if (password.length < 8 || !/\d/.test(password)) {
      setError("A senha deve ter pelo menos 8 caracteres e incluir um número.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não são iguais.");
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await authApi.register({
        email: email.trim(),
        password,
        businessName: businessName.trim() || null,
        displayName: null,
      });
      setUser(user);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível criar sua conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Criar conta" subtitle="Comece a criar orçamentos profissionais em minutos.">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <FormField label="Nome da sua empresa" htmlFor="businessName" hint="Você pode alterar isso depois, em Empresa.">
          <Input
            id="businessName"
            name="businessName"
            autoComplete="organization"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Ex: Studio Ana"
          />
        </FormField>

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

        <FormField label="Senha" htmlFor="password" required hint="Mínimo de 8 caracteres, com pelo menos um número.">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </FormField>

        <FormField label="Confirmar senha" htmlFor="confirmPassword" required>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </FormField>

        {error ? (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth isLoading={isSubmitting} loadingText="Criando conta...">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Já tem uma conta?{" "}
        <Link href="/login" className="font-medium text-brand-700 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthCard>
  );
}
