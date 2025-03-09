import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import CollageContainer from '@/components/CollageContainer';
import { MusicCollageJsonLd } from '@/components/CollageContainer';
import type { GridSize } from '@/lib/lastfm';
import { Locale, locales, getMessages } from '@/lib/i18n';

export const revalidate = 3600; 

const allowedTypes = ['albums'];

const isValidGridSize = (gridSize: string): gridSize is GridSize => {
  return ['3x3', '4x4', '5x5', '10x10'].includes(gridSize);
};

export async function generateMetadata({ params, searchParams }: { 
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);
  
  // Get username from URL params for dynamic metadata
  const username = typeof resolvedSearchParams.username === 'string' ? resolvedSearchParams.username : '';
  const period = typeof resolvedSearchParams.period === 'string' ? resolvedSearchParams.period : 'overall';
  const type = typeof resolvedSearchParams.type === 'string' && allowedTypes.includes(resolvedSearchParams.type) ? resolvedSearchParams.type : 'albums';
  
  // Create a period display text for better readability
  let periodText = '';
  switch(period) {
    case '7day': periodText = 'last 7 days'; break;
    case '1month': periodText = 'last month'; break;
    case '3month': periodText = 'last 3 months'; break;
    case '6month': periodText = 'last 6 months'; break;
    case '12month': periodText = 'last 12 months'; break;
    case 'overall': periodText = 'all time'; break;
    default: periodText = 'all time';
  }
  
  // If we have a username, create personalized metadata
  if (username) {
    const title = `${username}'s Top ${type === 'albums' ? 'Albums' : 'Artists'} from ${periodText} | Collage.fm`;
    const description = `View ${username}'s top ${type} from ${periodText} on Last.fm, visualized as a beautiful collage. Create your own music collage at Collage.fm.`;
    
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'website',
        url: `https://collagefm.vercel.app/${locale}/collage?username=${username}&type=${type}&period=${period}`,
        siteName: 'Collage.fm',
        images: [
          {
            url: 'https://collagefm.vercel.app/og-image.png',
            width: 1200,
            height: 630,
            alt: `${username}'s Top ${type} Collage from ${periodText}`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://collagefm.vercel.app/og-image.png'],
        creator: '@rhuanbello',
      },
    };
  }
  
  // Default metadata if no username is provided
  return {
    title: messages.meta.title,
    description: messages.meta.description,
    openGraph: {
      type: 'website',
      url: `https://collagefm.vercel.app/${locale}/collage`,
      title: messages.meta.title,
      description: messages.meta.description,
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
      title: messages.meta.title,
      description: messages.meta.description,
      images: ['https://collagefm.vercel.app/og-image.png'],
      creator: '@rhuanbello',
    },
  };
}

interface CollagePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Add this function to improve the semantic structure and HTML tags
function CollageErrorState({ message, locale }: { message: string, locale: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5" aria-hidden="true">
        <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
      </div>
      
      <section className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-gray-800/30 max-w-md w-full relative z-10">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Error</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <Link 
          href={`/${locale}`} 
          className="inline-block w-full text-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
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
    // Return the error component with proper message and structure
    return <CollageErrorState message={messages.errors.noUsername} locale={locale} />;
  }

  try {
    // Restore the original API call logic
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
    
    // If no data returned, show error state
    if (!collageData || !collageData.items || collageData.items.length === 0) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-5" aria-hidden="true">
            <div className="absolute -top-40 right-[10%] w-96 h-96 bg-purple-500/10 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
            <div className="absolute -bottom-40 left-[10%] w-96 h-96 bg-blue-500/10 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          </div>
          
          <section className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 rounded-2xl p-8 shadow-2xl border border-white/30 dark:border-gray-800/30 max-w-md w-full relative z-10 text-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{messages.errors.noData}</h1>
            <Link 
              href={`/${locale}`} 
              className="inline-block px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
            >
              {messages.collage.backToForm}
            </Link>
          </section>
        </main>
      );
    }
    
    // Process the data for structured data
    const structuredDataItems = collageData.items.map((item: { name: string; artist?: string; imageUrl: string }) => ({
      name: item.name,
      url: `https://www.last.fm/music/${encodeURIComponent(item.artist || '')}/${encodeURIComponent(item.name || '')}`,
      artist: item.artist,
      image: [{ '#text': item.imageUrl, size: 'extralarge' }]
    }));

    return (
      <main className="min-h-screen overflow-hidden relative">
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
          <div className="relative z-10 py-8">
            <CollageContainer 
              initialData={collageData}
              gridSize={gridSize}
              type={type}
              locale={locale}
            />
          </div>
        </Suspense>
        
        {/* Add structured data */}
        <MusicCollageJsonLd
          username={username}
          period={period}
          type={type}
          items={structuredDataItems}
        />
      </main>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <CollageErrorState message={messages.errors.failedToLoad} locale={locale} />;
  }
} 