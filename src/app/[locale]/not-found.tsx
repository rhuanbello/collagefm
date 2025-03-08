'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations();
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5">
        <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
      </div>
      
      <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-gray-800/30 max-w-md w-full relative z-10">
        <div className="text-center space-y-4">
          <div className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
            {t('errors.pageNotFound')}
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            {t('errors.pageNotFoundDesc')}
          </p>
          <div className="pt-4">
            <Link 
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {t('common.backToHome')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 