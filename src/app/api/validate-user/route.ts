import { NextRequest, NextResponse } from 'next/server';
import { validateLastFMUsername } from '@/lib/lastfm';
import { Locale, defaultLocale } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  
  const acceptLanguage = request.headers.get('accept-language') || '';
  const locale = acceptLanguage.includes('pt-BR') ? 'pt-BR' : defaultLocale as Locale;
  
  
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { error: locale === 'pt-BR' ? 'Nome de usuário é obrigatório' : 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const isValid = await validateLastFMUsername(username);
    
    if (isValid) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json(
        { 
          valid: false,
          error: locale === 'pt-BR' ? 'Usuário do Last.fm não encontrado' : 'Last.fm user not found'
        },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error validating user:', error);
    
    return NextResponse.json(
      { 
        valid: false,
        error: locale === 'pt-BR' 
          ? 'Erro ao validar o usuário do Last.fm' 
          : 'Error validating Last.fm user'
      },
      { status: 500 }
    );
  }
} 