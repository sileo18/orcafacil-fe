"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { FullScreenLoading } from "@/components/ui/FullScreenLoading";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? "/dashboard" : "/login");
  }, [isLoading, user, router]);

  return <FullScreenLoading label="Abrindo o Orçamento Fácil..." />;
}
