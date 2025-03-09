# Collage.fm

Collage.fm is a web application that generates visual collages of your most listened artists and albums on Last.fm. Create beautiful grids of your music taste to share with friends or on social media.

## Features

- Generate collages of your top artists or albums from Last.fm
- Choose from different time periods (1 week, 1 month, 3 months, 6 months, 12 months, or all time)
- Select different grid sizes (3×3, 4×4, 5×5, or 10×10)
- Customize your collage with titles and play count display options
- Download high-quality images of your collages
- Username persistence with cookies for easy repeat visits
- Full internationalization support (currently English and Portuguese)
- Modern, responsive UI built with Next.js and Shadcn/ui
- Dark mode and light mode support with system preference detection
- Mobile-friendly design

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [TailwindCSS 4](https://tailwindcss.com/) - CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Next-Intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Next-Themes](https://github.com/pacocoursey/next-themes) - Theme management
- [Zod](https://zod.dev/) - Form validation
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [html2canvas-pro](https://html2canvas.hertzen.com/) - Screenshot generation
- [Last.fm API](https://www.last.fm/api) - Music data

## Getting Started

### Prerequisites

- Node.js 18.x or later
- A Last.fm API key (get one [here](https://www.last.fm/api/account/create))

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/collagefm.git
   cd collagefm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your Last.fm API key:
   ```
   LASTFM_API_KEY=your_lastfm_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter your Last.fm username
2. Select whether you want to see top artists or albums
3. Choose a time period
4. Select a grid size
5. Click "Generate Collage"
6. View your collage with customization options:
   - Toggle display of titles
   - Toggle display of play counts
7. Download your collage as a high-quality image

## Internationalization

Collage.fm supports multiple languages:

- English (en)
- Portuguese (pt-BR)

The application automatically detects your browser's language preference, but you can manually switch languages using the language selector in the UI.

## Code Architecture

The application follows modern React best practices with a focus on component modularity and separation of concerns:

- **Components**: UI elements organized by functionality
- **Hooks**: Custom React hooks for shared logic
- **Utils**: Utility functions including image processing
- **Lib**: Core functionality and API integrations

### Image Download Module

The image download functionality has been optimized for:

- **Performance**: Efficient DOM manipulation and rendering
- **Modularity**: Broken down into smaller, focused functions
- **Image Optimization**: Compression to reduce file size while maintaining quality
- **Customization**: Options for styling, titles, and play count display

The image generation and download process:
1. Creates a virtual DOM structure with the collage content
2. Renders it to a canvas using html2canvas-pro
3. Applies image compression and optimization
4. Generates a downloadable PNG file

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Last.fm](https://www.last.fm/) for providing the API
- Inspired by similar tools like LastCollage and TapMusic
