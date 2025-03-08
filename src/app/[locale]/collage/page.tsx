import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CollageContainer from '@/components/CollageContainer';
import type { GridSize } from '@/lib/lastfm';
import { Locale, locales, getMessages } from '@/lib/i18n';


export const revalidate = 3600; 


const allowedTypes = ['artists', 'albums'];


const isValidGridSize = (gridSize: string): gridSize is GridSize => {
  return ['3x3', '4x4', '5x5', '10x10'].includes(gridSize);
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

interface CollagePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollagePage({
  params,
  searchParams,
}: CollagePageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  // Get username from URL params
  const username = typeof resolvedSearchParams.username === 'string' ? resolvedSearchParams.username : '';
  const period = typeof resolvedSearchParams.period === 'string' ? resolvedSearchParams.period : 'overall';
  const type = typeof resolvedSearchParams.type === 'string' && allowedTypes.includes(resolvedSearchParams.type) ? resolvedSearchParams.type : 'albums';
  const gridSizeParam = typeof resolvedSearchParams.gridSize === 'string' ? resolvedSearchParams.gridSize : '3x3';
  const gridSize = isValidGridSize(gridSizeParam) ? gridSizeParam : '3x3';

  if (!username) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5">
          <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        </div>
        
        <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-gray-800/30 max-w-md w-full relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
              {messages.common.error}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {messages.errors.noUsername}
            </p>
            <div className="pt-4">
              <Link 
                href={`/${locale}`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {messages.common.back}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  try {
    
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/generate?username=${encodeURIComponent(username)}&period=${period}&gridSize=${gridSize}&type=${type}`,
      { next: { revalidate } }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return notFound();
      }
      throw new Error(`Error fetching data: ${res.status}`);
    }

    const collageData = await res.json();

    return (
      <main className="min-h-screen py-8 relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5">
          <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          <div className="absolute top-[20%] left-[5%] w-72 h-72 bg-cyan-500/10 dark:bg-cyan-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-2xl"></div>
          <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        </div>
        
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-[50vh] relative z-10">
            <div className="rounded-xl backdrop-blur-md bg-white/50 dark:bg-gray-900/50 p-8 flex flex-col items-center">
              <div className="relative w-16 h-16">
                <div className="absolute top-0 w-16 h-16 rounded-full border-4 border-purple-500/20 dark:border-purple-500/20 animate-ping"></div>
                <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              </div>
              <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 font-medium">
                {messages.common.loading}
              </p>
            </div>
          </div>
        }>
          
          <div className="relative z-10">
            <CollageContainer 
              initialData={collageData}
              username={username}
              period={period}
              gridSize={gridSize}
              type={type}
              locale={locale}
            />
          </div>
        </Suspense>
      </main>
    );
  } catch (error) {
    console.error("Failed to load collage data:", error);
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5">
          <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        </div>
        
        <div className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-gray-800/30 max-w-md w-full relative z-10">
          <div className="text-center space-y-4">
            <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400">
              {messages.common.error}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              {messages.errors.failedToLoad}
            </p>
            <div className="pt-4">
              <Link 
                href={`/${locale}`}
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {messages.common.back}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }
} 