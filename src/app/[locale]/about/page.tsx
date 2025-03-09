'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </header>

      <article className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('whatIs.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('whatIs.description')}
          </p>
          
          <div className="mt-6 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{t('features.title')}</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
              <li className="leading-relaxed"><span className="font-semibold">{t('features.gridSizes.title')}:</span> {t('features.gridSizes.description')}</li>
              <li className="leading-relaxed"><span className="font-semibold">{t('features.timePeriods.title')}:</span> {t('features.timePeriods.description')}</li>
              <li className="leading-relaxed"><span className="font-semibold">{t('features.downloadOptions.title')}:</span> {t('features.downloadOptions.description')}</li>
              <li className="leading-relaxed"><span className="font-semibold">{t('features.multilingual.title')}:</span> {t('features.multilingual.description')}</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('howItWorks.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('howItWorks.description')}
          </p>
          
          <ol className="list-decimal pl-6 space-y-4 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed">
              <span className="font-semibold">{t('howItWorks.steps.username.title')}</span> - {t('howItWorks.steps.username.description')}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">{t('howItWorks.steps.preferences.title')}</span> - {t('howItWorks.steps.preferences.description')}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">{t('howItWorks.steps.generate.title')}</span> - {t('howItWorks.steps.generate.description')}
            </li>
            <li className="leading-relaxed">
              <span className="font-semibold">{t('howItWorks.steps.download.title')}</span> - {t('howItWorks.steps.download.description')}
            </li>
          </ol>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('technology.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('technology.description')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed"><span className="font-semibold">{t('technology.nextjs.title')}</span> - {t('technology.nextjs.description')}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('technology.typescript.title')}</span> - {t('technology.typescript.description')}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('technology.tailwind.title')}</span> - {t('technology.tailwind.description')}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('technology.lastfmApi.title')}</span> - {t('technology.lastfmApi.description')}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('technology.framerMotion.title')}</span> - {t('technology.framerMotion.description')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('creator.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <a href="https://last.fm/user/rhuanbello" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Rhuan Bello
            </a>
            {', '}
            {t('creator.description1')}
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('creator.description2').replace('GitHub', '')}
            <a href="https://github.com/rhuanbello/collagefm" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              GitHub
            </a>
            {'.'}
          </p>
        </section>
      </article>

      <footer className="mt-12 mb-8 flex justify-center gap-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('buttons.backToHome')}
        </Link>
        <Link 
          href="/privacy" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {t('buttons.privacyPolicy')}
        </Link>
      </footer>
    </main>
  );
} 