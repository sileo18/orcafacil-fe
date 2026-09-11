import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const securityHeaders = [
  // Nunca "adivinhar" um Content-Type diferente do declarado.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // O frontend nunca precisa ser embutido num <iframe> de outro site (ao
  // contrário do preview do orçamento, que é a API embutindo conteúdo no
  // frontend — o caminho inverso). Bloqueia clickjacking.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  // Não vaza a URL completa de origem em navegação cross-site.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desliga por padrão APIs de browser que este app nunca usa.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Não anuncia "X-Powered-By: Next.js" — informação de tecnologia de
  // baixo valor pra quem usa o app (OWASP A05).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

// Permite acessar bindings do Cloudflare (ex.: env vars via wrangler) durante
// `next dev`, simulando o runtime do Workers em desenvolvimento local.
initOpenNextCloudflareForDev();
