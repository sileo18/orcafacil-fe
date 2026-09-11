import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Configuração mínima. Sem override de incremental cache (R2) por enquanto —
// o app não depende de ISR/revalidação; se isso mudar, ver
// https://opennext.js.org/cloudflare/caching para habilitar cache com R2.
export default defineCloudflareConfig();
