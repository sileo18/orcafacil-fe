import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { THEME_STORAGE_KEY } from "@/lib/utils/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orçamento Fácil",
  description: "Crie orçamentos profissionais em poucos segundos e compartilhe pelo WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#10121a" },
  ],
};

// Roda antes do React hidratar, direto no <head>, pra decidir claro/escuro
// sem "flash" da cor errada. Não pode virar um efeito React (rodaria tarde
// demais, depois do primeiro paint). localStorage/matchMedia podem lançar
// em ambientes restritos (ex.: alguns modos privados) — por isso o
// try/catch silencioso, caindo no claro (padrão) se algo falhar.
const themeInitScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full">
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
