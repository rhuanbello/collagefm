import { createTranslator } from 'next-intl';


export const locales = ['en', 'pt-BR'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';


export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}


export async function getMessages(locale: Locale) {
  
  if (!isValidLocale(locale)) {
    throw new Error(`Locale ${locale} is not supported.`);
  }

  return (await import(`../messages/${locale}.json`)).default;
}


export function getPlural(count: number) {
  return count === 1 ? 'one' : 'other';
}


export function formatNumber(number: number, locale: string) {
  return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US').format(number);
}


export function createClientTranslator(messages: Record<string, unknown>, locale: Locale = defaultLocale) {
  return {
    t: createTranslator({ locale, messages }),
    locale,
  };
}


export function formatDate(date: Date, locale: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
} 