import { NextRequest, NextResponse } from 'next/server';
import { Locale, defaultLocale } from '@/lib/i18n';
import { fetchAlbumCollageData, fetchArtistCollageData } from '@/lib/lastfm';

export async function GET(request: NextRequest) {
  
  const acceptLanguage = request.headers.get('accept-language') || '';
  const locale = acceptLanguage.includes('pt-BR') ? 'pt-BR' : defaultLocale as Locale;
  
  
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const period = searchParams.get('period') || 'overall';
  const type = searchParams.get('type') || 'albums';
  const gridSize = searchParams.get('gridSize') || '3x3';
  
  
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }
  
  try {
    let data;
    
    if (type === 'albums') {
      data = await fetchAlbumCollageData(username, period, gridSize);
    } else {
      data = await fetchArtistCollageData(username, period, gridSize);
    }
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API error:', error);
    
    
    if (error instanceof Error && error.message === 'User not found') {
      return NextResponse.json(
        { error: locale === 'pt-BR' ? 'Usuário não encontrado' : 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: locale === 'pt-BR' ? 'Erro ao buscar dados' : 'Error fetching data' },
      { status: 500 }
    );
  }
} 