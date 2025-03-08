import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas-pro';
import { PERIODS } from '@/lib/lastfm';
import { Button } from '@/components/ui/button';

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

interface CollageDisplayProps {
  username: string;
  period: string;
  gridSize: string;
  type: string;
}

export default function CollageDisplay({ username, period, gridSize, type }: CollageDisplayProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // Separate loading state for download
  const [error, setError] = useState<string | null>(null);
  const [collageData, setCollageData] = useState<CollageData | null>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCollageData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch the collage data from our API
        const response = await fetch(
          `/api/generate?username=${username}&period=${period}&gridSize=${gridSize}&type=${type}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to generate collage');
        }

        const data = await response.json();
        setCollageData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollageData();
  }, [username, period, gridSize, type]);

  // Calculate grid columns based on the gridSize
  const getGridColumns = () => {
    const [cols] = gridSize.split('x');
    // Use a mapping approach instead of dynamic class generation
    const gridColsMap: Record<string, string> = {
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '5': 'grid-cols-5',
      '10': 'grid-cols-10'
    };
    return gridColsMap[cols] || 'grid-cols-3'; // Default to 3 columns if not found
  };

  // Handle going back to form
  const handleBack = () => {
    router.push('/');
  };

  // Handle download functionality
  const handleDownload = async () => {
    if (!collageRef.current || !collageData) return;
    
    try {
      // Show downloading state ONLY for the button
      setIsDownloading(true);
      
      // Use html2canvas to capture the collage element
      const canvas = await html2canvas(collageRef.current, {
        useCORS: true, // Enable CORS for images
        scale: 2, // Higher quality
        backgroundColor: null // Preserve transparency
      });
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${username}-${type}-${period}-${gridSize}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error generating download:', err);
      alert('Failed to download collage. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Generating your collage...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-4 mb-4 text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/20 rounded-md">
          <p>Error: {error}</p>
        </div>
        <Button onClick={handleBack}>Back to Form</Button>
      </div>
    );
  }

  if (!collageData || collageData.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="p-4 mb-4 text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/20 rounded-md">
          <p>No data found for this user and period combination.</p>
        </div>
        <Button onClick={handleBack}>Back to Form</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">
          {collageData.username}&apos;s Top {collageData.type === 'artists' ? 'Artists' : 'Albums'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {PERIODS[collageData.period as keyof typeof PERIODS]} • {collageData.gridSize} grid
        </p>

        <Button onClick={handleBack} variant="outline" className="mr-2">
          Back to Form
        </Button>
        
        <Button 
          onClick={handleDownload}
          className="ml-2"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <span className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              Downloading...
            </>
          ) : (
            'Download Collage'
          )}
        </Button>
      </div>

      <div className="max-w-screen-lg mx-auto">
        <div 
          ref={collageRef} 
          className={`grid ${getGridColumns()} gap-0`}
        >
          {collageData.items.map((item, index) => (
            <div 
              key={`${item.name}-${index}`} 
              className="relative aspect-square overflow-hidden group"
            >
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-800">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">No image</span>
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 text-white p-2 text-center">
                <p className="font-bold text-sm truncate w-full">{item.name}</p>
                {item.artist && (
                  <p className="text-xs truncate w-full">by {item.artist}</p>
                )}
                <p className="text-xs mt-1">{item.playcount} plays</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 