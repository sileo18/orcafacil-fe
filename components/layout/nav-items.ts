import { LayoutDashboard, FileText, Users, Package, Building2 } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/quotes", label: "Orçamentos", icon: FileText },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/products", label: "Produtos", icon: Package },
  { href: "/business", label: "Empresa", icon: Building2 },
] as const;

// Bottom nav do mobile fica só com os 4 principais — "Empresa" é uma
// configuração, não uma ação do dia a dia (PROMPT-MOBILEFIRST.md #1).
export const mobileNavItems = navItems.slice(0, 4);
