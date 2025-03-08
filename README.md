# LastMosaic

LastMosaic is a web application that generates visual collages of your most listened artists and albums on Last.fm. Create beautiful grids of your music taste to share with friends or on social media.

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
   git clone https://github.com/yourusername/lastmosaic.git
   cd lastmosaic
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

LastMosaic supports multiple languages:

- English (en)
- Portuguese (pt-BR)

The application automatically detects your browser's language preference, but you can manually switch languages using the language selector in the UI.

## Deployment

This project can be easily deployed to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Flastmosaic)

Remember to add your `LASTFM_API_KEY` to the environment variables in your Vercel project settings.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Last.fm](https://www.last.fm/) for providing the API
- Inspired by similar tools like LastCollage and TapMusic
