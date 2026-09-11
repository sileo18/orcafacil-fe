"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <FullScreenLoading />;
  }

  return <AppShell>{children}</AppShell>;
}
