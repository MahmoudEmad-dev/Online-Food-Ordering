type CurrencyConfig = {
  locale: string;
  currency: string;
};

const currencyMap: Record<string, CurrencyConfig> = {
  en: { locale: 'en-US', currency: 'USD' },
  ar: { locale: 'ar-EG', currency: 'EGP' },
};

/**
 * Formats a numeric amount as a localized currency string.
 * Automatically selects the currency based on the active i18n language.
 *
 * @param amount - The numeric value to format
 * @param lang - The active language code ('en' | 'ar')
 * @returns Formatted currency string (e.g., "$12.99" or "١٢٫٩٩ ج.م")
 */
export function formatCurrency(amount: number, lang: string = 'en'): string {
  const config = currencyMap[lang] || currencyMap['en'];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default formatCurrency;
