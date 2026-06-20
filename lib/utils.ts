/**
 * Format a number as Indonesian Rupiah currency string.
 * @example formatCurrency(2850000) => "Rp 2.850.000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Encode a string for safe use in a WhatsApp `wa.me` URL.
 * Encodes the full text so special characters (newlines, &, etc.) don't break the URI.
 */
export function safeUri(text: string): string {
  return encodeURIComponent(text);
}
