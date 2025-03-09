import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Create Last.fm Music Collages | Collage.fm',
  description: 'Generate beautiful personalized collages of your top artists and albums from Last.fm. Create and share your music taste visually.',
  metadataBase: new URL('https://collagefm.vercel.app'),
  keywords: ['last.fm', 'music collage', 'album collage', 'lastfm collage', 'music visualization', 'album artwork'],
  authors: [{ name: 'Rhuan Bello' }],
  creator: 'Rhuan Bello',
  publisher: 'Collage.fm',
  icons: [
    { rel: 'icon', url: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon.svg' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    title: 'Collage.fm',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://collagefm.vercel.app',
    title: 'Create Last.fm Music Collages | Collage.fm',
    description: 'Generate beautiful personalized collages of your top artists and albums from Last.fm. Create and share your music taste visually.',
    siteName: 'Collage.fm',
    images: [
      {
        url: 'https://collagefm.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Collage.fm - Create beautiful music collages from your Last.fm profile',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Last.fm Music Collages | Collage.fm',
    description: 'Generate beautiful personalized collages of your top artists and albums from Last.fm.',
    images: ['https://collagefm.vercel.app/og-image.png'],
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
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1E293B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="collagefm-theme"
        >
          
          <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-20"></div>
          
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
