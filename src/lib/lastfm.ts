import axios from 'axios';
  

const API_KEY = process.env.LASTFM_API_KEY || '';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';


export const PERIODS = {
  '7day': 'Last 7 days',
  '1month': 'Last 30 days',
  '3month': 'Last 3 months',
  '6month': 'Last 6 months',
  '12month': 'Last 12 months',
  'overall': 'All time'
};

export const PERIOD_OPTIONS = [
  { value: '7day', label: PERIODS['7day'] },
  { value: '1month', label: PERIODS['1month'] },
  { value: '3month', label: PERIODS['3month'] },
  { value: '6month', label: PERIODS['6month'] },
  { value: '12month', label: PERIODS['12month'] },
  { value: 'overall', label: PERIODS['overall'] },
];

export const GRID_SIZE_OPTIONS = [
  { value: '3x3', label: '3×3 (9 items)' },
  { value: '4x4', label: '4×4 (16 items)' },
  { value: '5x5', label: '5×5 (25 items)' },
  { value: '10x10', label: '10×10 (100 items)' },
];


export type GridSize = '3x3' | '4x4' | '5x5' | '10x10';


export const getGridItemsCount = (gridSize: GridSize): number => {
  const [rows, cols] = gridSize.split('x').map(Number);
  return rows * cols;
};


const fetchFromLastFM = async (params: Record<string, string>) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        api_key: API_KEY,
        format: 'json',
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching from Last.fm:', error);
    throw error;
  }
};


export const validateLastFMUsername = async (username: string): Promise<boolean> => {
  try {
    await fetchFromLastFM({
      method: 'user.getinfo',
      user: username,
    });
    return true;
  } catch {
    return false;
  }
};

interface LastFmArtist {
  name: string;
  playcount: string;
  image: { '#text': string; size: string }[];
}

interface LastFmAlbum {
  name: string;
  artist: {
    name: string;
  };
  playcount: string;
  image: { '#text': string; size: string }[];
}

export interface CollageItem {
  name: string;
  artist?: string;
  playcount: number;
  imageUrl: string;
}

export interface CollageData {
  username: string;
  period: string;
  type: string;
  gridSize: string;
  items: CollageItem[];
}

function getLimit(gridSize: string): number {
  switch (gridSize) {
    case '3x3': return 9;
    case '4x4': return 16;
    case '5x5': return 25;
    case '10x10': return 100;
    default: return 9;
  }
}


export async function fetchAlbumCollageData(username: string, period: string, gridSize: string): Promise<CollageData> {
  try {
    const limit = getLimit(gridSize);
    
    const params = new URLSearchParams({
      method: 'user.getTopAlbums',
      user: username,
      period: period,
      limit: limit.toString(),
      api_key: API_KEY,
      format: 'json'
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const data = await response.json();
      if (data.error === 6) {
        throw new Error('User not found');
      }
      throw new Error(`API error: ${data.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.topalbums || !data.topalbums.album) {
      throw new Error('Invalid response format');
    }
    
    const items: CollageItem[] = data.topalbums.album.map((album: LastFmAlbum) => ({
      name: album.name,
      artist: album.artist.name,
      playcount: parseInt(album.playcount, 10),
      imageUrl: album.image[3]['#text'] || '' 
    }));
    
    return {
      username,
      period,
      type: 'albums',
      gridSize,
      items
    };
  } catch (error) {
    console.error('Error fetching top albums:', error);
    throw error;
  }
}


export async function fetchArtistCollageData(username: string, period: string, gridSize: string): Promise<CollageData> {
  try {
    const limit = getLimit(gridSize);
    
    const params = new URLSearchParams({
      method: 'user.getTopArtists',
      user: username,
      period: period,
      limit: limit.toString(),
      api_key: API_KEY,
      format: 'json'
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);
    
    if (!response.ok) {
      const data = await response.json();
      if (data.error === 6) {
        throw new Error('User not found');
      }
      throw new Error(`API error: ${data.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.topartists || !data.topartists.artist) {
      throw new Error('Invalid response format');
    }
    
    const items: CollageItem[] = data.topartists.artist.map((artist: LastFmArtist) => ({
      name: artist.name,
      playcount: parseInt(artist.playcount, 10),
      imageUrl: artist.image[3]['#text'] || '' 
    }));
    
    return {
      username,
      period,
      type: 'artists',
      gridSize,
      items
    };
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
} 