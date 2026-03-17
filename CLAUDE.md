# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the theSmoothPath website - a Portuguese business consulting and digital solutions company. The project is a Vercel-hosted static website with serverless API functions.

**Key Technologies:**
- **Frontend**: Static HTML with Tailwind CSS, Lucide icons, custom CSS
- **Backend**: Vercel serverless functions (Node.js/JavaScript)
- **Build Tool**: Vercel CLI with TypeScript support (tsx for development)
- **Deployment**: Vercel platform

## Project Structure

```
.
├── frontend/              # Static website files
│   ├── index.html        # Main HTML file with inline CSS/JS
│   └── assets/           # Images, fonts, logos
│       ├── font/         # Custom Allenoire font files
│       ├── img/          # Hero images and graphics
│       └── logo/         # Logo and favicon
├── api/                  # Serverless API functions
│   ├── ping.js          # Health check endpoint
│   └── contact.js       # Contact form submission handler
├── package.json         # Node.js dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vercel.json         # Vercel deployment configuration
└── .env.local          # Local environment variables (gitignored)
```

## Development Commands

### Local Development
```bash
# Start local development server with Vercel
npm run dev

# Run tests (if any)
npm test
```

### Deployment
```bash
# Deploy to production
npm run deploy
```

### Direct Vercel Commands
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# View deployment logs
vercel logs
```

## Architecture Notes

### Frontend
- Single-page HTML file with inline CSS and JavaScript
- Uses Tailwind CSS via CDN with custom theme configuration
- Custom font (Allenoire) loaded locally from `/assets/font/allenoire/`
- Lucide icons loaded via CDN
- Responsive design with mobile-first approach
- Contact form submits to `/api/contact` endpoint
- Debug mode enabled in JavaScript (set `DEBUG = false` for production)

### Backend API
- Serverless functions in `/api/` directory
- `contact.js`: Handles contact form submissions (currently returns mock success)
- `ping.js`: Health check endpoint for monitoring
- Functions use Vercel's Node.js runtime with CORS headers

### Vercel Configuration
- Static file serving for frontend (`@vercel/static`)
- Serverless functions for API routes (`@vercel/node`)
- Custom routing in `vercel.json`:
  - `/api/*` → API functions
  - `/assets/*` → Frontend assets
  - All other routes → `index.html` (SPA routing)
- Node.js version 20 specified

### Styling System
- Primary colors: `chocolate` (#592112), `orange` (#f7710e), `cream` (#faf0e6)
- Custom CSS variables defined in `:root`
- Tailwind configuration extends theme with custom colors and font
- Font stack: Inter (Google Fonts) + Allenoire (custom) for headings

## Important Files

### `vercel.json`
Defines build and routing configuration for Vercel deployment. Key routes:
- API routes map to serverless functions
- Assets served from frontend directory
- SPA routing for all other paths

### `frontend/index.html`
Complete website with:
- Business description and services
- Contact form with JavaScript validation
- Mobile-responsive navigation
- Fade-in animations using Intersection Observer
- Debug logging system

### `api/contact.js`
Contact form handler that:
- Validates required fields (nome, email, mensagem)
- Returns mock success response (needs email integration)
- Includes CORS headers for cross-origin requests

## Development Workflow

1. **Local Development**: Run `npm run dev` to start Vercel dev server
2. **Testing**: Contact form submits to local API endpoint
3. **Deployment**: Push to main branch or use `vercel` CLI
4. **Environment**: No build step - static files served directly

## Notes for Future Development

- Contact form currently returns mock success - needs real email integration
- Debug logging is enabled (`DEBUG = true`) - disable for production
- Font files are large - consider optimization or CDN hosting
- No build process - all CSS/JS is inline in HTML
- Consider separating CSS/JS into external files for caching
- Add form spam protection (reCAPTCHA or similar)
- Implement proper email service (SendGrid, Resend, etc.)