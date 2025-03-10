'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { formatNumber } from '@/lib/i18n';
import { Logo } from '@/components/svg/Logo';
import { PERIODS } from '@/lib/lastfm';
import { downloadCollageImage } from '@/utils/imageDownloader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Confetti } from '@/components/ui/confetti';
import Link from 'next/link';
import { BuyMeACoffeeButton } from '@/components/ui/buy-me-a-coffee';
import { BorderBeam } from './ui/border-beam';
interface CollageItem {
  name: string;
  artist?: string;
  playcount: number;
  imageUrl: string;
}

interface CollageData {
  username: string;
  period: string;
  type: string;
  gridSize: string;
  items: CollageItem[];
}

interface CollageContainerProps {
  initialData: CollageData;
  username: string;
  period: string;
  gridSize: string;
  type: string;
  locale: string;
}

export default function CollageContainer({
  initialData,
  gridSize,
  type,
  locale
}: Omit<CollageContainerProps, 'username' | 'period'>) {
  const t = useTranslations();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [collageData] = useState<CollageData | null>(initialData);
  const collageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dateString, setDateString] = useState<string>('');
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [showPlayCount, setShowPlayCount] = useState(true);
  const [showStyles, setShowStyles] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState<string>('normal');
  const [downloadProgress, setDownloadProgress] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDateString(new Date().toLocaleDateString(locale === 'en' ? 'en-US' : 'pt-BR'));
  }, [locale]);

  const getGridColumns = () => {
    const [cols] = gridSize.split('x');
    const gridColsMap: Record<string, string> = {
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '5': 'grid-cols-5',
      '10': 'grid-cols-10'
    };
    return gridColsMap[cols] || 'grid-cols-3';
  };

  const handleBack = () => {
    router.push(`/${locale}`);
  };
  
  const openDownloadOptions = () => {
    setShowConfetti(false);
    setShowDownloadModal(true);
  };
  
  const cancelDownload = () => {
    setShowDownloadModal(false);
  };
  
  const processDownload = () => {
    setShowDownloadModal(false);
    handleDownload();
  };

  const handleDownload = async () => {
    if (!collageRef.current || !collageData) return;
    
    try {
      setIsDownloading(true);
      setDownloadProgress(t('common.processing'));
      setShowConfetti(false);
      
      const tFn = t as unknown as (key: string, params?: Record<string, string | number | undefined>) => string;
      
      await downloadCollageImage(
        collageRef as React.RefObject<HTMLDivElement>,
        collageData,
        {
          showTitles,
          showPlayCount,
          showStyles,
          locale,
          dateString,
          t: tFn,
          formatNumber,
          isDarkMode: document.documentElement.classList.contains('dark'),
          compressionLevel: compressionLevel as 'high' | 'normal' | 'low'
        },
        {
          onError: (err) => {
            console.error('Error generating download:', err);
            alert(t('errors.failedToGenerate'));
          },
          onComplete: () => {
            setIsDownloading(false);
            setDownloadProgress('');
            setTimeout(() => {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 5000);
            }, 300);
          },
          onProgress: (message) => {
            setDownloadProgress(message);
          }
        }
      );
    } catch (err) {
      console.error('Error generating download:', err);
      alert(t('errors.failedToGenerate'));
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };

  if (!collageData || collageData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 mb-6 text-yellow-700 bg-yellow-100/80 dark:text-yellow-300 dark:bg-yellow-900/30 rounded-xl backdrop-blur-md border border-yellow-200 dark:border-yellow-800/50 shadow-lg"
        >
          <p className="font-medium">{t('collage.noData')}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Button 
            onClick={handleBack}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            {t('collage.backToForm')}
          </Button>
        </motion.div>
      </div>
    );
  }

  const renderDownloadModal = () => (
    <AnimatePresence>
      {showDownloadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={cancelDownload}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {t('collage.downloadOptions')}
            </h3>
            
            <div className="space-y-5 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{t('collage.showTitles')}</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="showTitles" 
                    checked={showTitles}
                    onChange={() => setShowTitles(!showTitles)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="showTitles" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showTitles ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${showTitles ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{t('collage.showPlayCount')}</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="showPlayCount" 
                    checked={showPlayCount}
                    onChange={() => setShowPlayCount(!showPlayCount)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="showPlayCount" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showPlayCount ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${showPlayCount ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{t('collage.showStyles')}</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input 
                    type="checkbox" 
                    id="showStyles" 
                    checked={showStyles}
                    onChange={() => setShowStyles(!showStyles)}
                    className="sr-only"
                  />
                  <label 
                    htmlFor="showStyles" 
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${showStyles ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span 
                      className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${showStyles ? 'translate-x-4' : 'translate-x-0'}`} 
                    />
                  </label>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('collage.compressionLevel')}</h4>
                <Select 
                  value={compressionLevel} 
                  onValueChange={setCompressionLevel}
                >
                  <SelectTrigger className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm h-10 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                    <SelectValue placeholder={t('collage.compressionLevel')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md">
                    <SelectItem value="high" className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{t('collage.compressionHigh')} - {t('collage.bestQuality')}</SelectItem>
                    <SelectItem value="normal" className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{t('collage.compressionNormal')} - {t('collage.balanced')}</SelectItem>
                    <SelectItem value="low" className="text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">{t('collage.compressionLow')} - {t('collage.smallerFile')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={cancelDownload}
                variant="outline"
                className="flex-1 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 bg-gray-800/50 dark:hover:bg-gray-700"
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={processDownload}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
              >
                {t('common.apply')}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderProgressOverlay = () => (
    <AnimatePresence>
      {isDownloading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl max-w-sm w-full text-center"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-indigo-300 border-b-indigo-200 border-l-indigo-400 rounded-full animate-spin"></div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('common.downloading')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {downloadProgress || t('common.processing')}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti 
          particleCount={500}
          spread={250}
          colors={["#F43F5E", "#EC4899", "#D946EF", "#8B5CF6", "#6366F1", "#3B82F6", "#0EA5E9"]}
          origin={{ x: 0.5, y: 0.25 }}
          gravity={1}
          decay={0.9}
          drift={0.5}
          ticks={500}
        />
      )}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container max-w-6xl mx-auto px-4 py-6 md:py-10"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/20 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center relative z-10 mt-6"
        >
          <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            {t('collage.title', {
              username: collageData.username,
              type: t(`collage.top${type === 'artists' ? 'Artists' : 'Albums'}`)
            })}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
            {t(`form.period.options.${collageData.period as keyof typeof PERIODS}`)} • {collageData.gridSize} grid
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleBack} 
                variant="outline" 
                className="px-6 py-2 rounded-full backdrop-blur-sm bg-white/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-white/90 dark:hover:bg-gray-800/70 shadow-sm hover:shadow transition-all duration-300"
              >
                {t('collage.backToForm')}
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={openDownloadOptions}
                disabled={isDownloading}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
              >
                {isDownloading ? (
                  <>
                    <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                    {t('common.downloading')}
                  </>
                ) : (
                  t('collage.downloadCollage')
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {renderDownloadModal()}
        {renderProgressOverlay()}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 overflow-hidden border border-gray-200/50 dark:border-gray-700/30 shadow-xl"
        >
          <BorderBeam 
            duration={6}
            delay={6}
            size={1000}
            className="from-transparent via-indigo-600 to-transparent"  
          />

          <BorderBeam 
            duration={6}
            delay={3}
            size={1000}
            className="from-transparent via-purple-600 to-transparent"  
          />

          <div className="p-1">
            <div 
              ref={collageRef} 
              className={`grid ${getGridColumns()} gap-0`}
            >
              {collageData.items.map((item, index) => (
                <motion.div 
                  key={`${item.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: mounted ? 1 : 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: mounted ? 0.1 + (index * 0.02) : 0
                  }}
                  className="relative aspect-square overflow-hidden group"
                >
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{t('collage.noImage')}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end text-white p-4 text-center">
                    <p className="font-bold text-sm truncate w-full">{item.name}</p>
                    {item.artist && (
                      <p className="text-xs truncate w-full opacity-90">{t('common.by')} {item.artist}</p>
                    )}
                    <div className="mt-2 flex items-center justify-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs">{formatNumber(item.playcount, locale)} {t('common.plays')}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center justify-center gap-1">
            <span>{t('common.generatedWith')}</span> 
            <Logo className="w-4 h-4" /> 
            <span className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              {t('common.collagefm')}
            </span>
            {mounted && <span>• {dateString}</span>}
          </div>

          <BuyMeACoffeeButton text={t('home.footer.buyMeACoffee')} forceRelative className='mt-6'/>

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
        </motion.footer>
      </motion.div>
    </div>
  );
}

// Add MusicCollageJsonLd component for structured data
interface MusicCollageJsonLdProps {
  username: string;
  period: string;
  type: string;
  items: Array<{
    name: string;
    url: string;
    artist?: string;
    image?: Array<{
      '#text': string;
      size: string;
    }>;
  }>;
}

export function MusicCollageJsonLd({ username, period, type, items }: MusicCollageJsonLdProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Early return if we don't have data
  if (!items || items.length === 0) return null;
  
  // Get formatted time period for display
  const getPeriodName = (period: string): string => {
    switch(period) {
      case '7day': return 'Last 7 days';
      case '1month': return 'Last month';
      case '3month': return 'Last 3 months';
      case '6month': return 'Last 6 months';
      case '12month': return 'Last 12 months';
      case 'overall': return 'All time';
      default: return 'All time';
    }
  };

  // Don't render during SSR
  if (!mounted) return null;

  // Create JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${username}'s Top ${type === 'albums' ? 'Albums' : 'Artists'} - ${getPeriodName(period)}`,
    'description': `A visual collage of ${username}'s most listened ${type} on Last.fm for ${getPeriodName(period).toLowerCase()}.`,
    'url': window.location.href,
    'numberOfItems': items.length,
    'itemListElement': items.map((item, index: number) => ({
      '@type': type === 'albums' ? 'MusicAlbum' : 'MusicGroup',
      'position': index + 1,
      'name': item.name,
      'url': item.url,
      ...(type === 'albums' && {
        'byArtist': {
          '@type': 'MusicGroup',
          'name': item.artist
        }
      }),
      'image': item.image?.[3]?.['#text'] || ''
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
} 