"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { authApi } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Estado de autenticação vive no cliente porque o cookie de sessão é
 * emitido por uma API em outro domínio (produção: Azure Static Web Apps
 * + Railway) — o servidor do Next.js nunca o vê. Ver README →
 * "Decisões arquiteturais".
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const current = await authApi.me();
      setUser(current);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca a sessão uma única vez quando o app carrega. `refresh` só
    // chama setState depois de um `await` (fora do corpo síncrono do
    // efeito); é o padrão padrão de "buscar sessão ao montar" e não tem
    // um sistema externo para "assinar" no lugar de um efeito aqui.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoading, refresh, setUser, logout }),
    [user, isLoading, refresh, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth precisa ser usado dentro de <AuthProvider>.");
  }
  return ctx;
}
