'use client';

import { useTranslations } from 'next-intl';
import CollageForm from '@/components/CollageForm';
import { Logo } from '@/components/svg/Logo';
import Link from 'next/link';
import { BuyMeACoffeeButton } from '@/components/ui/buy-me-a-coffee';
import { BorderBeam } from '@/components/ui/border-beam';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-3xl mx-auto">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob" aria-hidden="true"></div>
        <div className="absolute top-60 -left-20 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000" aria-hidden="true"></div>
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000" aria-hidden="true"></div>
      </div>
      
      <header className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center mb-2 mt-4">
          <Logo aria-hidden="true" />
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 px-2 py-1 leading-relaxed">
            {t('common.collagefm')}
          </h1>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md mx-auto mt-2">
          {t('home.tagline')}
        </p>
      </header>
      
      <section className="w-full max-w-md backdrop-blur-md bg-white/50 dark:bg-gray-900/50 rounded-2xl overflow-hidden border border-white/30 dark:border-gray-800/30 shadow-2xl relative z-10">
        <h2 className="sr-only">Generate Your Music Collage</h2>
        <CollageForm />

        <BorderBeam
          duration={10}
          delay={6}
          size={400}
          className="from-transparent via-indigo-600 to-transparent"
        />
      </section>
      
      <footer className="mt-4 md:mt-16 text-center text-sm text-gray-600 dark:text-gray-400 relative z-10 max-w-md mx-auto">
        <BuyMeACoffeeButton text={t('home.footer.buyMeACoffee')} />

        <p className="mb-2">
          {t('home.footer.builtWith')} <a href="https://last.fm/user/rhuanbello" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">@rhuanbello</a>
        </p>
        
        <p>
          <a 
            href="https://github.com/rhuanbello/collagefm"
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
            aria-label="View source code on GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            {t('home.footer.viewOnGitHub')}
          </a>
        </p>
     
        <p className="mt-2">
          <Link href="/about" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-4">{t('home.footer.menu.about')}</Link>
          <Link href="/privacy" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mr-4">{t('home.footer.menu.privacy')}</Link>
          <Link href="/sitemap.xml" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">{t('home.footer.menu.sitemap')}</Link>
        </p>
      </footer>

    </main>
  );
} 