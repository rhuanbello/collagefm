import { NextRequest, NextResponse } from 'next/server';
import { getTopArtists, getTopAlbums, validateLastFMUsername } from '@/lib/lastfm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const period = searchParams.get('period') || 'overall';
  const type = searchParams.get('type') || 'artists'; // artists or albums
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  // Validate required parameters
  if (!username) {
    return NextResponse.json(
      { error: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    // Validate the username first
    const isValidUsername = await validateLastFMUsername(username);
    if (!isValidUsername) {
      return NextResponse.json(
        { error: 'Invalid Last.fm username' },
        { status: 404 }
      );
    }

    // Fetch the data based on type
    let data;
    if (type === 'artists') {
      data = await getTopArtists(username, period, limit);
    } else if (type === 'albums') {
      data = await getTopAlbums(username, period, limit);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "artists" or "albums"' },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Last.fm' },
      { status: 500 }
    );
  }
} 