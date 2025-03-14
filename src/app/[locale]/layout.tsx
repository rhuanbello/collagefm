import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { locales, Locale, getMessages } from "@/lib/i18n";

type Params = { locale: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  
  const localePrefix = locale === 'en' ? '' : `/${locale}`;
  
  return {
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
      url: `https://collagefm.com${localePrefix}`,
    },
    twitter: {
      title: messages.meta.title,
      description: messages.meta.description,
    },
    alternates: {
      canonical: `https://collagefm.com${localePrefix}`,
      languages: {
        'en': 'https://collagefm.com',
        'pt-BR': 'https://collagefm.com/pt-BR',
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<Params>;
}) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC" now={new Date()}>
      <div className="absolute top-4 left-4 z-40 md:z-50 md:right-16 md:left-auto">
        <LanguageSwitcher />
      </div>
      <div className="absolute top-4 right-4 z-40 md:z-50">
        <ThemeToggle />
      </div>
      <main>
        {children}
      </main>
    </NextIntlClientProvider>
  );
} 