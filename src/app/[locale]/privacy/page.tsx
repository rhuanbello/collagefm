'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('privacy');

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('lastUpdated')}</p>
      </header>

      <article className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.introduction.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.introduction.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.informationCollect.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.informationCollect.content')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed"><span className="font-semibold">{t('sections.informationCollect.username.title')}</span>: {t('sections.informationCollect.username.description').replace("'s", "'s")}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('sections.informationCollect.usageData.title')}</span>: {t('sections.informationCollect.usageData.description')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.howWeUse.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.howWeUse.content')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed">{t('sections.howWeUse.generateCollages')}</li>
            <li className="leading-relaxed">{t('sections.howWeUse.improveWebsite')}</li>
            <li className="leading-relaxed">{t('sections.howWeUse.analyzeUsage')}</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.howWeUse.noStorage')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.thirdParty.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.thirdParty.content')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed"><span className="font-semibold">{t('sections.thirdParty.lastfmApi.title')}</span>: {t('sections.thirdParty.lastfmApi.description')}</li>
            <li className="leading-relaxed"><span className="font-semibold">{t('sections.thirdParty.vercel.title')}</span>: {t('sections.thirdParty.vercel.description')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.cookies.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.cookies.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.security.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.security.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.rights.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.rights.content')}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li className="leading-relaxed">{t('sections.rights.access')}</li>
            <li className="leading-relaxed">{t('sections.rights.correct')}</li>
            <li className="leading-relaxed">{t('sections.rights.object')}</li>
            <li className="leading-relaxed">{t('sections.rights.restrict')}</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.changes.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.changes.content')}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">{t('sections.contact.title')}</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('sections.contact.content').split('https://github.com/rhuanbello/collagefm')[0]}
            <a href="https://github.com/rhuanbello/collagefm" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              https://github.com/rhuanbello/collagefm
            </a>
            {t('sections.contact.content').split('https://github.com/rhuanbello/collagefm')[1] || '.'}
          </p>
        </section>
      </article>

      <footer className="mt-12 mb-8 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('buttons.backToHome')}
        </Link>
      </footer>
    </main>
  );
} 