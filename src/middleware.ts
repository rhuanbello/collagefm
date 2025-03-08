import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales, defaultLocale, Locale } from '@/lib/i18n';


const intlMiddleware = createMiddleware({
  
  locales,
  
  defaultLocale,
  
  localeDetection: true
});


export default function middleware(request: NextRequest) {
  
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  
  if (!savedLocale || !locales.includes(savedLocale as Locale)) {
    const detectedLocale = detectUserLocale(request);
    
    
    const response = intlMiddleware(request);
    
    
    response.cookies.set('NEXT_LOCALE', detectedLocale, {
      maxAge: 365 * 24 * 60 * 60, 
      path: '/',
    });
    
    return response;
  }
  
  
  return intlMiddleware(request);
}


function detectUserLocale(request: NextRequest): Locale {
  
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    
    const parsedLocales = acceptLanguage.split(',').map(item => {
      const [locale, quality = 'q=1.0'] = item.trim().split(';');
      const q = parseFloat(quality.split('=')[1]);
      return { locale: locale.split('-')[0], quality: q };
    });

    
    parsedLocales.sort((a, b) => b.quality - a.quality);

    
    for (const { locale } of parsedLocales) {
      
      if (locales.includes(locale as Locale)) {
        return locale as Locale;
      }
      
      
      if (locale === 'pt' && locales.includes('pt-BR' as Locale)) {
        return 'pt-BR' as Locale;
      }
    }
  }

  
  return defaultLocale;
}


export const config = {
  
  
  
  
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 