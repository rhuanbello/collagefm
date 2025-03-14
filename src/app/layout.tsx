import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleTagManager } from '@next/third-parties/google'
import { locales } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"] });

const metadataByLocale = {
  'en': {
    title: 'Last.fm Collage Generator | Collage.fm',
    description: 'Generate beautiful personalized collages of your top artists and albums from Last.fm. Create and share your music taste visually.',
    openGraphTitle: 'Last.fm Collage Generator | Collage.fm',
    openGraphDescription: 'Generate beautiful personalized collages of your top artists and albums from Last.fm. Create and share your music taste visually.',
    twitterTitle: 'Last.fm Collage Generator | Collage.fm',
    twitterDescription: 'Generate beautiful personalized collages of your top artists and albums from Last.fm.',
    locale: 'en_US',
  },
  'pt-BR': {
    title: 'Last.fm Collage Generator | Collage.fm',
    description: 'Gere belas colagens personalizadas dos seus artistas e álbuns favoritos do Last.fm. Crie e compartilhe seu gosto musical visualmente.',
    openGraphTitle: 'Gerador de Colagens de Artistas do Last.fm | Collage.fm',
    openGraphDescription: 'Gere belas colagens personalizadas dos seus artistas e álbuns favoritos do Last.fm. Crie e compartilhe seu gosto musical visualmente.',
    twitterTitle: 'Last.fm Collage Generator | Collage.fm',
    twitterDescription: 'Gere belas colagens personalizadas dos seus artistas e álbuns favoritos do Last.fm.',
    locale: 'pt_BR',
  }
};

const alternateLanguages = locales.reduce((acc, locale) => {
  acc[locale] = `https://collagefm.com/${locale === 'en' ? '' : locale}`;
  return acc;
}, {} as Record<string, string>);

export const metadata: Metadata = {
  title: {
    default: metadataByLocale['en'].title,
    template: '%s | Collage.fm',
  },
  description: metadataByLocale['en'].description,
  metadataBase: new URL('https://collagefm.com'),
  keywords: ['last.fm', 'music collage', 'album collage', 'lastfm collage', 'music visualization', 'album artwork'],
  authors: [{ name: 'Rhuan Bello' }],
  creator: 'Rhuan Bello',
  publisher: 'Collage.fm',
  icons: [
    { rel: 'icon', url: '/favicon.ico', sizes: 'any' },
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon.svg' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Collage.fm',
    statusBarStyle: 'black-translucent',
  },
  alternates: {
    languages: alternateLanguages,
    canonical: 'https://collagefm.com',
  },
  openGraph: {
    type: 'website',
    url: 'https://collagefm.com',
    siteName: 'Collage.fm',
    title: metadataByLocale['en'].openGraphTitle,
    description: metadataByLocale['en'].openGraphDescription,
    locale: 'en_US',
    alternateLocale: ['pt_BR'],
    images: [
      {
        url: 'https://collagefm.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Collage.fm - Create beautiful music collages from your Last.fm profile',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metadataByLocale['en'].twitterTitle,
    description: metadataByLocale['en'].twitterDescription,
    images: ['https://collagefm.com/og-image.png'],
    creator: '@rhuanbello',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'Owc7djKwVF6Xz-6h7rAJrq8PFS6EQbmQtQgnZX6Ch4E',
  }
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`} suppressHydrationWarning>
        <GoogleTagManager gtmId="GTM-TBDS4WJZ" />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="collagefm-theme"
        >
          <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-20"></div>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
