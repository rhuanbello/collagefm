import html2canvas from 'html2canvas-pro';
import { RefObject } from 'react';

/**
 * Interface for collage item data
 */
interface CollageItem {
  name: string;
  artist?: string;
  playcount: number;
  imageUrl: string;
}

/**
 * Interface for overall collage data
 */
interface CollageData {
  username: string;
  period: string;
  type: string;
  gridSize: string;
  items: CollageItem[];
}

/**
 * Compression options for controlling image quality and size
 */
interface CompressionOptions {
  /** Quality level from 0 to 1 (lower = smaller file size) */
  quality: number;
  /** Maximum width of the image in pixels (preserves aspect ratio) */
  maxWidth?: number;
  /** Format of the output file - JPEG has much smaller file sizes than PNG */
  format: 'image/jpeg' | 'image/png';
  /** Whether to preserve transparency (only applies to PNG) */
  preserveTransparency?: boolean;
}

/**
 * Default aggressive compression options for various size targets
 */
const COMPRESSION_PRESETS = {
  high: { quality: 1.0, format: 'image/png' as const },
  normal: { quality: 0.8, format: 'image/jpeg' as const, maxWidth: 2400 },
  low: { quality: 0.6, format: 'image/jpeg' as const, maxWidth: 1800 },
};

/**
 * Configuration options for the collage image download
 */
interface DownloadOptions {
  showTitles: boolean;
  showPlayCount: boolean;
  showStyles: boolean;
  locale: string;
  dateString: string;
  t: (key: string, params?: Record<string, string | number | undefined>) => string;
  formatNumber: (num: number, locale: string) => string;
  isDarkMode: boolean;
  /** Compression level for the downloaded image */
  compressionLevel?: keyof typeof COMPRESSION_PRESETS | CompressionOptions;
}

/**
 * Creates and returns a styled export container for the collage
 * @param collageData The data for the collage
 * @param options Configuration options for styling
 * @returns HTML container element ready for rendering
 */
function createExportContainer(collageData: CollageData, options: DownloadOptions): HTMLElement {
  const { showStyles, isDarkMode } = options;
  
  const exportContainer = document.createElement('div');
  
  if (showStyles) {
    // Set styling for regular collage with styling
    exportContainer.style.width = '1200px';
    exportContainer.style.padding = '40px';
    exportContainer.style.backgroundColor = isDarkMode ? '#111827' : '#f8fafc';
    exportContainer.style.borderRadius = '16px';
    exportContainer.style.overflow = 'hidden';
    exportContainer.style.position = 'relative';
    
    // Add gradient overlay
    const gradientOverlay = createGradientOverlay(isDarkMode);
    exportContainer.appendChild(gradientOverlay);
    
    // Add header
    const headerDiv = createHeader(collageData, options);
    exportContainer.appendChild(headerDiv);
  } else {
    // Simple container for pure collage
    exportContainer.style.width = '1200px';
    exportContainer.style.padding = '0';
    exportContainer.style.overflow = 'hidden';
    exportContainer.style.position = 'relative';
  }
  
  // Add grid with items
  const gridDiv = createCollageGrid(collageData, options);
  exportContainer.appendChild(gridDiv);
  
  // Add footer if styles are enabled
  if (showStyles) {
    const footer = createFooter(options);
    exportContainer.appendChild(footer);
  }
  
  return exportContainer;
}

/**
 * Creates a gradient overlay element for the collage background
 * @param isDarkMode Whether dark mode is enabled
 * @returns HTML element with gradient styling
 */
function createGradientOverlay(isDarkMode: boolean): HTMLElement {
  const gradientOverlay = document.createElement('div');
  gradientOverlay.style.position = 'absolute';
  gradientOverlay.style.top = '0';
  gradientOverlay.style.left = '0';
  gradientOverlay.style.width = '100%';
  gradientOverlay.style.height = '100%';
  gradientOverlay.style.opacity = '0.08';
  gradientOverlay.style.background = isDarkMode
    ? 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.5), transparent 70%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.5), transparent 70%)'
    : 'radial-gradient(circle at top right, rgba(124, 58, 237, 0.3), transparent 70%), radial-gradient(circle at bottom left, rgba(59, 130, 246, 0.3), transparent 70%)';
  
  return gradientOverlay;
}

/**
 * Creates the header section of the collage
 * @param collageData The data for the collage
 * @param options Configuration options
 * @returns Header HTML element
 */
function createHeader(collageData: CollageData, options: DownloadOptions): HTMLElement {
  const { t, isDarkMode } = options;
  
  const headerDiv = document.createElement('div');
  headerDiv.style.marginBottom = '30px';
  headerDiv.style.textAlign = 'center';
  headerDiv.style.position = 'relative';
  headerDiv.style.zIndex = '1';
  
  // Create title container for flexbox layout
  const titleContainer = document.createElement('div');
  titleContainer.style.display = 'flex';
  titleContainer.style.alignItems = 'center';
  titleContainer.style.justifyContent = 'center';
  titleContainer.style.gap = '8px';
  titleContainer.style.marginBottom = '8px';
  
  const title = document.createElement('h1');
  title.textContent = t('collage.title', { 
    username: collageData.username, 
    type: t(`collage.top${collageData.type === 'artists' ? 'Artists' : 'Albums'}`)
  });
  title.style.fontSize = '36px';
  title.style.fontWeight = 'bold';
  title.style.color = isDarkMode ? '#6366f1' : '#4f46e5';
  
  titleContainer.appendChild(title);
  headerDiv.appendChild(titleContainer);
  
  const subtitle = document.createElement('p');
  subtitle.textContent = `${t(`form.period.options.${collageData.period}`)}`;
  subtitle.style.fontSize = '16px';
  subtitle.style.color = isDarkMode ? '#d1d5db' : '#4b5563';
  headerDiv.appendChild(subtitle);
  
  return headerDiv;
}

/**
 * Creates the grid containing all collage items
 * @param collageData The data for the collage
 * @param options Configuration options
 * @returns Grid HTML element with all items
 */
function createCollageGrid(collageData: CollageData, options: DownloadOptions): HTMLElement {
  const { showStyles, isDarkMode } = options;
  
  const gridDiv = document.createElement('div');
  gridDiv.style.display = 'grid';
  
  const [cols] = collageData.gridSize.split('x');
  gridDiv.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  gridDiv.style.gap = '0';
  
  if (showStyles) {
    gridDiv.style.border = isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)';
    gridDiv.style.borderRadius = '12px';
    gridDiv.style.overflow = 'hidden';
    gridDiv.style.boxShadow = isDarkMode
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
      : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
  }
  
  collageData.items.forEach((item) => {
    const itemContainer = createCollageItem(item, options);
    gridDiv.appendChild(itemContainer);
  });
  
  return gridDiv;
}

/**
 * Creates a single collage item with image and text overlay
 * @param item The item data
 * @param options Configuration options
 * @returns Item container HTML element
 */
function createCollageItem(item: CollageItem, options: DownloadOptions): HTMLElement {
  const { showTitles, showPlayCount, isDarkMode, t } = options;
  
  const itemContainer = document.createElement('div');
  itemContainer.style.position = 'relative';
  itemContainer.style.aspectRatio = '1/1';
  itemContainer.style.overflow = 'hidden';
  
  if (item.imageUrl) {
    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    itemContainer.appendChild(img);
  } else {
    const fallback = document.createElement('div');
    fallback.style.width = '100%';
    fallback.style.height = '100%';
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.style.background = isDarkMode
      ? 'linear-gradient(to bottom right, #1f2937, #111827)'
      : 'linear-gradient(to bottom right, #e5e7eb, #d1d5db)';
    
    const fallbackText = document.createElement('span');
    fallbackText.textContent = t('collage.noImage');
    fallbackText.style.color = isDarkMode
      ? '#6b7280'
      : '#9ca3af';
    fallbackText.style.fontSize = '14px';
    
    fallback.appendChild(fallbackText);
    itemContainer.appendChild(fallback);
  }
  
  if (showTitles || showPlayCount) {
    const textOverlay = createItemTextOverlay(item, options);
    itemContainer.appendChild(textOverlay);
  }
  
  return itemContainer;
}

/**
 * Creates the text overlay for an item showing title, artist, and/or play count
 * @param item The item data
 * @param options Configuration options
 * @returns Text overlay HTML element
 */
function createItemTextOverlay(item: CollageItem, options: DownloadOptions): HTMLElement {
  const { showTitles, showPlayCount, t, formatNumber, locale } = options;
  
  const textOverlay = document.createElement('div');
  textOverlay.style.position = 'absolute';
  textOverlay.style.bottom = '0';
  textOverlay.style.left = '0';
  textOverlay.style.width = '100%';
  textOverlay.style.padding = '12px 8px 8px';
  textOverlay.style.background = 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.6) 70%, transparent)';
  textOverlay.style.color = 'white';
  textOverlay.style.textAlign = 'center';
  
  if (showTitles) {
    const itemTitle = document.createElement('p');
    itemTitle.textContent = item.name;
    itemTitle.style.fontWeight = 'bold';
    itemTitle.style.fontSize = '12px';
    itemTitle.style.margin = '0';
    itemTitle.style.padding = '0';
    itemTitle.style.whiteSpace = 'nowrap';
    itemTitle.style.overflow = 'hidden';
    itemTitle.style.textOverflow = 'ellipsis';
    textOverlay.appendChild(itemTitle);
    
    if (item.artist) {
      const artist = document.createElement('p');
      artist.textContent = `${t('common.by')} ${item.artist}`;
      artist.style.fontSize = '10px';
      artist.style.margin = '2px 0 0';
      artist.style.padding = '0';
      artist.style.opacity = '0.9';
      artist.style.whiteSpace = 'nowrap';
      artist.style.overflow = 'hidden';
      artist.style.textOverflow = 'ellipsis';
      textOverlay.appendChild(artist);
    }
  }
  
  if (showPlayCount) {
    const plays = document.createElement('p');
    const formattedCount = formatNumber(item.playcount, locale);
    
    const keyPath = item.playcount === 1 ? 'pluralization.plays.one' : 'pluralization.plays.other';
    plays.textContent = t(keyPath, { count: formattedCount });
    
    plays.style.fontSize = '10px';
    plays.style.margin = showTitles ? '4px 0 0' : '0';
    plays.style.padding = '0';
    plays.style.opacity = '0.75';
    textOverlay.appendChild(plays);
  }
  
  return textOverlay;
}

/**
 * Creates the footer with logo and attribution
 * @param options Configuration options
 * @returns Footer HTML element
 */
function createFooter(options: DownloadOptions): HTMLElement {
  const { isDarkMode, dateString, t } = options;
  
  const footer = document.createElement('div');
  footer.style.marginTop = '25px';
  footer.style.textAlign = 'center';
  footer.style.fontSize = '14px';
  footer.style.color = isDarkMode ? '#9ca3af' : '#6b7280';
  footer.style.position = 'relative';
  footer.style.zIndex = '1';
  
  const footerText = document.createElement('p');
  footerText.textContent = `${t('common.generatedWith')} `;
  
  // Create SVG logo element
  const footerSvgLogo = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  footerSvgLogo.setAttribute('viewBox', '0 0 48 34');
  footerSvgLogo.setAttribute('width', '16');
  footerSvgLogo.setAttribute('height', '16');
  footerSvgLogo.style.display = 'inline-block';
  footerSvgLogo.style.verticalAlign = 'middle';
  footerSvgLogo.style.marginRight = '4px';
  
  const footerLogoGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  footerLogoGroup.setAttribute('transform', 'translate(0, 0.5)');
  
  const footerPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  footerPath1.setAttribute('d', 'M16.0573 0H37.1389L21.6397 22.9729H0.558105L16.0573 0Z');
  footerPath1.setAttribute('fill', '#6366F1');
  
  const footerPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  footerPath2.setAttribute('d', 'M16.9805 25.102L10.9773 34H33.0589L48.5581 11.0271H32.2605L22.7645 25.102H16.9805Z');
  footerPath2.setAttribute('fill', '#8B5CF6');
  
  footerLogoGroup.appendChild(footerPath1);
  footerLogoGroup.appendChild(footerPath2);
  footerSvgLogo.appendChild(footerLogoGroup);
  
  footerText.appendChild(footerSvgLogo);
  
  const textNode = document.createTextNode(` Collage.fm • ${dateString}`);
  footerText.appendChild(textNode);
  
  footer.appendChild(footerText);
  return footer;
}

/**
 * Compresses an image data URL to dramatically reduce file size while maintaining acceptable quality
 * @param dataUrl The original image data URL
 * @param options Compression options to control quality vs. file size
 * @returns Promise that resolves to a compressed image data URL
 */
async function compressImage(
  dataUrl: string, 
  options: CompressionOptions = COMPRESSION_PRESETS.normal
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a temporary canvas for processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        return resolve(dataUrl); // Fall back to original if context not available
      }
      
      // Calculate new dimensions if maxWidth is specified
      let newWidth = img.width;
      let newHeight = img.height;
      
      if (options.maxWidth && img.width > options.maxWidth) {
        const aspectRatio = img.height / img.width;
        newWidth = options.maxWidth;
        newHeight = Math.floor(newWidth * aspectRatio);
      }
      
      // Set canvas dimensions to the new size
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // For JPEG format, set a background color since it doesn't support transparency
      if (options.format === 'image/jpeg' && !options.preserveTransparency) {
        ctx.fillStyle = '#FFFFFF'; // White background
        ctx.fillRect(0, 0, newWidth, newHeight);
      }
      
      // Draw image on canvas at the new size
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Apply unsharp masking for better perceived quality at lower file sizes
      if (options.quality < 0.5) {
        applyUnsharpMask(ctx, newWidth, newHeight);
      }
      
      // Get compressed image with specified format and quality
      const compressedDataUrl = canvas.toDataURL(options.format, options.quality);
      
      // Check if the compression actually reduced the file size
      if (compressedDataUrl.length >= dataUrl.length) {
        console.warn('Compression did not reduce file size, using original image');
        resolve(dataUrl);
      } else {
        resolve(compressedDataUrl);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = dataUrl;
  });
}

/**
 * Applies unsharp masking to enhance perceived sharpness after downscaling
 * This helps maintain important details in highly compressed images
 */
function applyUnsharpMask(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  // Get image data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  // Create a simple sharpening convolution matrix
  const strength = 0.5; // Sharpening strength (0.1 to 1.0)
  const blurredData = new Uint8ClampedArray(data.length);
  
  // Apply a simple blur first (3x3 average kernel)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) { // Just RGB channels, not alpha
        const i = (y * width + x) * 4 + c;
        
        // Calculate average of surrounding pixels
        blurredData[i] = (
          data[i - width * 4 - 4] + data[i - width * 4] + data[i - width * 4 + 4] +
          data[i - 4] + data[i] + data[i + 4] +
          data[i + width * 4 - 4] + data[i + width * 4] + data[i + width * 4 + 4]
        ) / 9;
      }
      // Copy alpha channel as is
      const i = (y * width + x) * 4 + 3;
      blurredData[i] = data[i];
    }
  }
  
  // Apply unsharp mask: original + (original - blurred) * strength
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c++) { // Just RGB channels
      const diff = data[i + c] - blurredData[i + c];
      data[i + c] = Math.min(255, Math.max(0, data[i + c] + diff * strength));
    }
  }
  
  // Put the modified image data back
  ctx.putImageData(imageData, 0, 0);
}

/**
 * Generates and downloads a collage image
 * 
 * @param collageRef React ref to the collage HTML element
 * @param collageData The data for the collage
 * @param options Configuration options for the download
 * @param callbacks Callback functions for different stages of the process
 * @returns Promise that resolves when download is complete
 */
export async function downloadCollageImage(
  collageRef: RefObject<HTMLDivElement>,
  collageData: CollageData,
  options: DownloadOptions,
  callbacks: {
    onStart?: () => void;
    onError?: (error: Error) => void;
    onComplete?: () => void;
    onProgress?: (message: string) => void;
  } = {}
): Promise<void> {
  if (!collageRef.current || !collageData) return;
  
  try {
    if (callbacks.onStart) callbacks.onStart();
    if (callbacks.onProgress) callbacks.onProgress(options.t('common.processing'));
    
    // Create temporary wrapper for export
    const exportWrapper = document.createElement('div');
    exportWrapper.style.position = 'fixed';
    exportWrapper.style.top = '-9999px';
    exportWrapper.style.left = '-9999px';
    document.body.appendChild(exportWrapper);
    
    // Create the export container with all elements
    const exportContainer = createExportContainer(collageData, options);
    exportWrapper.appendChild(exportContainer);
    
    if (callbacks.onProgress) callbacks.onProgress(options.t('common.rendering'));
    
    // Generate canvas from HTML
    const canvas = await html2canvas(exportContainer, {
      useCORS: true,
      scale: 2,
      backgroundColor: options.isDarkMode ? '#111827' : '#f8fafc',
      logging: false,
      allowTaint: true
    });
    
    // Remove the temporary elements
    document.body.removeChild(exportWrapper);
    
    // Get image data
    const dataUrl = canvas.toDataURL('image/png');
    
    if (callbacks.onProgress) callbacks.onProgress(options.t('common.compressing'));
    
    // Determine compression options
    let compressionOptions: CompressionOptions;
    
    if (options.compressionLevel) {
      if (typeof options.compressionLevel === 'string') {
        compressionOptions = COMPRESSION_PRESETS[options.compressionLevel];
      } else {
        compressionOptions = options.compressionLevel;
      }
    } else {
      // Default to normal compression
      compressionOptions = COMPRESSION_PRESETS.normal;
    }
    
    // Compress the image
    const compressedDataUrl = await compressImage(dataUrl, compressionOptions);
    
    // Create download link
    const link = document.createElement('a');
    const filePrefix = options.showStyles ? 'styled-' : '';
    const fileExtension = compressionOptions.format === 'image/jpeg' ? 'jpg' : 'png';
    
    link.download = `${filePrefix}${collageData.username}-${collageData.type}-${collageData.period}-${collageData.gridSize}.${fileExtension}`;
    link.href = compressedDataUrl;
    link.click();
    
    if (callbacks.onProgress) callbacks.onProgress(options.t('common.downloadComplete'));
  } catch (err) {
    console.error('Error generating download:', err);
    if (callbacks.onError) callbacks.onError(err instanceof Error ? err : new Error(String(err)));
  } finally {
    if (callbacks.onComplete) callbacks.onComplete();
  }
} 