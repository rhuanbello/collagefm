import axios from 'axios';
  
// You need to get an API key from last.fm
const API_KEY = process.env.LASTFM_API_KEY || '';
const BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

// Map period strings to last.fm API values
export const PERIODS = {
  '1week': 'Last 7 days',
  '1month': 'Last 30 days',
  '3month': 'Last 3 months',
  '6month': 'Last 6 months',
  '12month': 'Last 12 months',
  'overall': 'All time'
};

export const PERIOD_OPTIONS = [
  { value: '1week', label: PERIODS['1week'] },
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

// A type for the collage grid size
export type GridSize = '3x3' | '4x4' | '5x5' | '10x10';

// Helper to get the number of items needed for a grid
export const getGridItemsCount = (gridSize: GridSize): number => {
  const [rows, cols] = gridSize.split('x').map(Number);
  return rows * cols;
};

// API request wrapper
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

// Get top artists for a user
export const getTopArtists = async (
  username: string,
  period: string = 'overall',
  limit: number = 50
) => {
  return fetchFromLastFM({
    method: 'user.gettopartists',
    user: username,
    period,
    limit: limit.toString(),
  });
};

// Get top albums for a user
export const getTopAlbums = async (
  username: string,
  period: string = 'overall',
  limit: number = 50
) => {
  return fetchFromLastFM({
    method: 'user.gettopalbums',
    user: username,
    period,
    limit: limit.toString(),
  });
};

// Helper to validate a last.fm username
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