'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas-pro';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { formatNumber } from '@/lib/i18n';

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
  username, 
  period, 
  gridSize, 
  type,
  locale
}: CollageContainerProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [collageData] = useState<CollageData>(initialData);
  const collageRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [dateString, setDateString] = useState<string>('');
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTitles, setShowTitles] = useState(true);
  const [showPlayCount, setShowPlayCount] = useState(true);

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
      
      const exportWrapper = document.createElement('div');
      exportWrapper.style.position = 'fixed';
      exportWrapper.style.top = '-9999px';
      exportWrapper.style.left = '-9999px';
      document.body.appendChild(exportWrapper);
      
      const exportContainer = document.createElement('div');
      exportContainer.style.width = '1200px';
      exportContainer.style.padding = '40px';
      exportContainer.style.backgroundColor = document.documentElement.classList.contains('dark') 
        ? '#111827' 
        : '#f8fafc';
      exportContainer.style.borderRadius = '16px';
      exportContainer.style.overflow = 'hidden';
      exportContainer.style.position = 'relative';
      
      const gradientOverlay = document.createElement('div');
      gradientOverlay.style.position = 'absolute';
      gradientOverlay.style.top = '0';
      gradientOverlay.style.left = '0';
      gradientOverlay.style.width = '100%';
      gradientOverlay.style.height = '100%';
      gradientOverlay.style.opacity = '0.08';
      gradientOverlay.style.background = document.documentElement.classList.contains('dark')
        ? 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.5), transparent 70%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.5), transparent 70%)'
        : 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.3), transparent 70%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.3), transparent 70%)';
      exportContainer.appendChild(gradientOverlay);
      
      const headerDiv = document.createElement('div');
      headerDiv.style.marginBottom = '30px';
      headerDiv.style.textAlign = 'center';
      headerDiv.style.position = 'relative';
      headerDiv.style.zIndex = '1';
      
      const title = document.createElement('h1');
      title.textContent = t('collage.title', { 
        username: collageData.username, 
        type: t(`collage.top${type === 'artists' ? 'Artists' : 'Albums'}`)
      });
      title.style.fontSize = '36px';
      title.style.fontWeight = 'bold';
      title.style.marginBottom = '8px';
      title.style.color = document.documentElement.classList.contains('dark') 
        ? '#6366f1'
        : '#4f46e5';
      
      headerDiv.appendChild(title);
      
      const subtitle = document.createElement('p');
      subtitle.textContent = `${t(`form.period.options.${period}`)}`;
      subtitle.style.fontSize = '16px';
      subtitle.style.color = document.documentElement.classList.contains('dark') ? '#d1d5db' : '#4b5563';
      headerDiv.appendChild(subtitle);
      
      exportContainer.appendChild(headerDiv);
      
      const gridDiv = document.createElement('div');
      gridDiv.style.display = 'grid';
      
      const [cols] = gridSize.split('x');
      gridDiv.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      gridDiv.style.gap = '0';
      
      gridDiv.style.border = document.documentElement.classList.contains('dark')
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.1)';
      gridDiv.style.borderRadius = '12px';
      gridDiv.style.overflow = 'hidden';
      gridDiv.style.boxShadow = document.documentElement.classList.contains('dark')
        ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
        : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      
      collageData.items.forEach((item) => {
        const itemContainer = document.createElement('div');
        itemContainer.style.position = 'relative';
        itemContainer.style.aspectRatio = '1/1';
        itemContainer.style.overflow = 'hidden';
        
        if (item.imageUrl) {
          const img = document.createElement('img');
          img.src = item.imageUrl;
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
          itemContainer.appendChild(img);
        } else {
          const fallback = document.createElement('div');
          fallback.style.width = '100%';
          fallback.style.height = '100%';
          fallback.style.display = 'flex';
          fallback.style.alignItems = 'center';
          fallback.style.justifyContent = 'center';
          fallback.style.background = document.documentElement.classList.contains('dark')
            ? 'linear-gradient(to bottom right, #1f2937, #111827)'
            : 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)';
          
          const fallbackText = document.createElement('span');
          fallbackText.textContent = t('collage.noImage');
          fallbackText.style.color = document.documentElement.classList.contains('dark')
            ? '#6b7280'
            : '#9ca3af';
          fallbackText.style.fontSize = '14px';
          
          fallback.appendChild(fallbackText);
          itemContainer.appendChild(fallback);
        }
        
        if (showTitles || showPlayCount) {
          const textOverlay = document.createElement('div');
          textOverlay.style.position = 'absolute';
          textOverlay.style.bottom = '0';
          textOverlay.style.left = '0';
          textOverlay.style.width = '100%';
          textOverlay.style.padding = '12px 8px 8px';
          textOverlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.6) 70%, transparent)';
          textOverlay.style.color = 'white';
          textOverlay.style.textAlign = 'center';
          
          if (showTitles) {
            const itemTitle = document.createElement('p');
            itemTitle.textContent = item.name;
            itemTitle.style.fontWeight = 'bold';
            itemTitle.style.fontSize = '12px';
            itemTitle.style.margin = '0';
            itemTitle.style.padding = '0';
            itemTitle.style.whiteSpace = 'nowrap';
            itemTitle.style.overflow = 'hidden';
            itemTitle.style.textOverflow = 'ellipsis';
            textOverlay.appendChild(itemTitle);
            
            if (item.artist) {
              const artist = document.createElement('p');
              artist.textContent = `${t('common.by')} ${item.artist}`;
              artist.style.fontSize = '10px';
              artist.style.margin = '2px 0 0';
              artist.style.padding = '0';
              artist.style.opacity = '0.9';
              artist.style.whiteSpace = 'nowrap';
              artist.style.overflow = 'hidden';
              artist.style.textOverflow = 'ellipsis';
              textOverlay.appendChild(artist);
            }
          }
          
          if (showPlayCount) {
            const plays = document.createElement('p');
            const formattedCount = formatNumber(item.playcount, locale);
            
            const keyPath = item.playcount === 1 ? 'pluralization.plays.one' : 'pluralization.plays.other';
            plays.textContent = t(keyPath, { count: formattedCount });
            
            plays.style.fontSize = '10px';
            plays.style.margin = showTitles ? '4px 0 0' : '0';
            plays.style.padding = '0';
            plays.style.opacity = '0.75';
            textOverlay.appendChild(plays);
          }
          
          itemContainer.appendChild(textOverlay);
        }
        
        gridDiv.appendChild(itemContainer);
      });
      
      exportContainer.appendChild(gridDiv);
      
      const footer = document.createElement('div');
      footer.style.marginTop = '25px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '14px';
      footer.style.color = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280';
      footer.style.position = 'relative';
      footer.style.zIndex = '1';
      
      const footerText = document.createElement('p');
      footerText.textContent = `${t('common.generatedWith')} LastMosaic • ${dateString}`;
      
      footer.appendChild(footerText);
      exportContainer.appendChild(footer);
      
      exportWrapper.appendChild(exportContainer);
      
      const canvas = await html2canvas(exportContainer, {
        useCORS: true,
        scale: 2,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#111827' : '#f8fafc',
        logging: false,
        allowTaint: true
      });
      
      document.body.removeChild(exportWrapper);
      
      const dataUrl = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.download = `${username}-${type}-${period}-${gridSize}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating download:', err);
      alert(t('errors.failedToGenerate'));
    } finally {
      setIsDownloading(false);
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

  return (
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
        className="mb-8 text-center relative z-10"
      >
        <h1 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          {t('collage.title', {
            username: collageData.username,
            type: t(`collage.top${type === 'artists' ? 'Artists' : 'Albums'}`)
          })}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6 font-medium">
          {t(`form.period.options.${collageData.period}`)} • {collageData.gridSize} grid
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

      <AnimatePresence>
        {showDownloadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelDownload}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xs w-full overflow-hidden border border-gray-100 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                <h3 className="text-white text-lg font-medium">{t('collage.downloadOptions.title')}</h3>
                <p className="text-indigo-100 text-sm">{t('collage.downloadOptions.subtitle')}</p>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors select-none">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${showTitles ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-300 dark:border-gray-600'}`}>
                      {showTitles && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={showTitles} 
                      onChange={() => setShowTitles(!showTitles)} 
                    />
                    <span>{t('collage.downloadOptions.showTitle')}</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 text-gray-700 dark:text-gray-200 cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors select-none">
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center ${showPlayCount ? 'border-indigo-500 bg-indigo-500/10' : 'border-gray-300 dark:border-gray-600'}`}>
                      {showPlayCount && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={showPlayCount} 
                      onChange={() => setShowPlayCount(!showPlayCount)} 
                    />
                    <span>{t('collage.downloadOptions.showPlayCount')}</span>
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="py-2 rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-medium text-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={cancelDownload}
                  >
                    {t('common.cancel')}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="py-2 rounded-lg text-white font-medium text-sm bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-200 shadow-md"
                    onClick={processDownload}
                  >
                    {t('collage.downloadOptions.applyDownload')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="backdrop-blur-md bg-white/30 dark:bg-gray-900/30 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/30 shadow-xl"
      >
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400"
      >
        <p>{t('common.generatedWith')} LastMosaic {mounted ? `• ${dateString}` : ''}</p>
      </motion.div>
    </motion.div>
  );
} 