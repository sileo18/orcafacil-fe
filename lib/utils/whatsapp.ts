/**
 * Gera o link wa.me com mensagem pré-preenchida (PROMPT-APP.md #23).
 * Não integra a API oficial do WhatsApp no MVP — o usuário anexa o PDF
 * manualmente depois de baixá-lo.
 */
export function buildWhatsAppShareUrl(phone: string | null | undefined, message: string): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  const withCountryCode = digits.length > 0 && !digits.startsWith("55") ? `55${digits}` : digits;
  const base = withCountryCode ? `https://wa.me/${withCountryCode}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function buildQuoteWhatsAppMessage(params: {
  customerFirstName: string;
  businessName: string;
  totalFormatted: string;
}): string {
  return (
    `Olá, ${params.customerFirstName}! Aqui é da ${params.businessName}. ` +
    `Segue seu orçamento no valor de ${params.totalFormatted}. ` +
    `Qualquer dúvida, estou à disposição!`
  );
}

export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName;
}
