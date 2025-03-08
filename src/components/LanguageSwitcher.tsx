'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { locales, Locale } from '@/lib/i18n';

interface LanguageOption {
  locale: string;
  label: string;
  flag: React.ReactNode;
}





export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();

  const languageOptions: LanguageOption[] = [
    {
      locale: 'en',
      label: t('common.language.en'),
      flag: <Image src="https://flagcdn.com/w40/us.png" alt="United States" width={20} height={15} />
    },
    {
      locale: 'pt-BR',
      label: t('common.language.pt-BR'),
      flag: <Image src="https://flagcdn.com/w40/br.png" alt="Brazil" width={20} height={15} />
    },
  ];
  
  
  const currentOption = languageOptions.find(option => option.locale === locale);
  
  
  const handleLanguageChange = (newLocale: string) => {
    
    
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0] || '';
    const isFirstSegmentLocale = locales.includes(firstSegment as Locale);
    
    
    let pathWithoutLocale = '';
    if (isFirstSegmentLocale) {
      pathWithoutLocale = '/' + pathSegments.slice(1).join('/');
    } else {
      pathWithoutLocale = pathname;
    }
    
    
    if (pathWithoutLocale === '') {
      pathWithoutLocale = '/';
    }
    
    
    const url = new URL(window.location.href);
    const searchParams = url.search; 
    
    
    
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}${searchParams}`;
    
    
    document.cookie = `NEXT_LOCALE=${newLocale}; max-age=${365 * 24 * 60 * 60}; path=/`;
    
    
    router.push(newPath);
  };

  if (!currentOption) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-white/90 dark:bg-gray-800/90"
        >
          <motion.div 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }}
          >
            {currentOption.flag}
          </motion.div>
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.locale}
            className={`cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2 px-3 py-2 ${
              locale === option.locale ? 'bg-gray-100 dark:bg-gray-700' : ''
            }`}
            onClick={() => handleLanguageChange(option.locale)}
          >
            <span className="w-4 h-4">{option.flag}</span>
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 