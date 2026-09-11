/**
 * Chave do localStorage usada pelo dark mode. Fica num módulo neutro (sem
 * "use client") de propósito: app/layout.tsx (Server Component) precisa do
 * mesmo valor pra montar o script inline anti-flash, e um valor exportado
 * de um módulo "use client" vira uma referência opaca quando importado
 * por um Server Component (resolve pra `undefined` durante o render no
 * servidor) — foi exatamente esse bug que fez o tema nunca persistir entre
 * reloads.
 */
export const THEME_STORAGE_KEY = "orcamentofacil:theme";
