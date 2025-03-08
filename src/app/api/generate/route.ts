import { NextRequest, NextResponse } from 'next/server';
import { getGridItemsCount, GridSize } from '@/lib/lastfm';

interface LastFmImage {
  size: string;
  '#text': string;
}

interface LastFmArtist {
  name: string;
  playcount: string;
  image: LastFmImage[];
}

interface LastFmAlbum {
  name: string;
  playcount: string;
  artist: {
    name: string;
  };
  image: LastFmImage[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const period = searchParams.get('period') || 'overall';
  const type = searchParams.get('type') || 'albums';
  const gridSize = searchParams.get('gridSize') || '3x3';

  // Validate required parameters
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // Calculate number of items needed
    const limit = getGridItemsCount(gridSize as GridSize);

    // Fetch data from our API
    const fetchDataUrl = new URL(`${request.nextUrl.origin}/api/fetch-data`);
    fetchDataUrl.searchParams.append('username', username);
    fetchDataUrl.searchParams.append('period', period);
    fetchDataUrl.searchParams.append('type', type);
    fetchDataUrl.searchParams.append('limit', limit.toString());

    const response = await fetch(fetchDataUrl.toString());
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();

    // Process the data to create a collage structure
    // For top artists, use the data.topartists.artist array
    // For top albums, use the data.topalbums.album array
    const items = type === 'artists' 
      ? data.topartists?.artist || []
      : data.topalbums?.album || [];

    // Limit to the number of items we need
    const limitedItems = items.slice(0, limit);

    // Prepare the collage data
    const collageData = {
      username,
      period,
      type,
      gridSize,
      items: limitedItems.map((item: LastFmArtist | LastFmAlbum) => ({
        name: item.name,
        artist: type === 'albums' ? (item as LastFmAlbum).artist.name : undefined,
        playcount: parseInt(item.playcount, 10),
        imageUrl: item.image?.find((img: LastFmImage) => img.size === 'extralarge')?.['#text'] || '',
      })),
    };

    return NextResponse.json(collageData);
  } catch (error) {
    console.error('Error generating collage:', error);
    return NextResponse.json(
      { error: 'Failed to generate collage' },
      { status: 500 }
    );
  }
} 