import { NextRequest, NextResponse } from 'next/server';
import { Locale, defaultLocale } from '@/lib/i18n';
import { fetchAlbumCollageData, fetchArtistCollageData } from '@/lib/lastfm';

export async function GET(request: NextRequest) {
  
  const acceptLanguage = request.headers.get('accept-language') || '';
  const locale = acceptLanguage.includes('pt-BR') ? 'pt-BR' : defaultLocale as Locale;
  
  
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const period = searchParams.get('period') || 'overall';
  const type = searchParams.get('type') || 'artists'; 
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  
  
  if (!username) {
    return NextResponse.json(
      { error: locale === 'pt-BR' ? 'Nome de usuário é obrigatório' : 'Username is required' },
      { status: 400 }
    );
  }
  
  try {
    
    
    const gridSizeNeeded = limit <= 9 ? '3x3' : 
                           limit <= 16 ? '4x4' : 
                           limit <= 25 ? '5x5' : '10x10';
    
    let data;
    if (type === 'artists') {
      const collageData = await fetchArtistCollageData(username, period, gridSizeNeeded);
      
      data = {
        topartists: {
          artist: collageData.items.slice(0, limit).map(item => ({
            name: item.name,
            playcount: item.playcount.toString(),
            image: [
              { size: 'small', '#text': item.imageUrl },
              { size: 'medium', '#text': item.imageUrl },
              { size: 'large', '#text': item.imageUrl },
              { size: 'extralarge', '#text': item.imageUrl }
            ]
          }))
        }
      };
    } else if (type === 'albums') {
      const collageData = await fetchAlbumCollageData(username, period, gridSizeNeeded);
      
      data = {
        topalbums: {
          album: collageData.items.slice(0, limit).map(item => ({
            name: item.name,
            artist: { name: item.artist || '' },
            playcount: item.playcount.toString(),
            image: [
              { size: 'small', '#text': item.imageUrl },
              { size: 'medium', '#text': item.imageUrl },
              { size: 'large', '#text': item.imageUrl },
              { size: 'extralarge', '#text': item.imageUrl }
            ]
          }))
        }
      };
    } else {
      return NextResponse.json(
        { error: locale === 'pt-BR' ? 'Tipo inválido. Deve ser "artists" ou "albums"' : 'Invalid type. Must be "artists" or "albums"' },
        { status: 400 }
      );
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