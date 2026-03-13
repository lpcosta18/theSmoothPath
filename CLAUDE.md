# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for **theSmoothPath**, a Portuguese business consulting and digital tools company. The website is built as a single HTML file with inline CSS and JavaScript, using Tailwind CSS via CDN. It's deployed on Vercel as a static site.

## Technology Stack

- **Frontend**: Single HTML file (`index.html`) with inline CSS and JavaScript
- **CSS Framework**: Tailwind CSS v4.2.1 (loaded via CDN)
- **Icons**: Lucide Icons (loaded via CDN)
- **Fonts**: Inter (Google Fonts) + Allenoire (custom font)
- **Build Tools**: Tailwind CSS, PostCSS, Autoprefixer (dev dependencies only)
- **Deployment**: Vercel static hosting

## Development Commands

This project doesn't have a traditional build process since it uses Tailwind CSS via CDN. However:

- **Install dependencies**: `npm install`
- **No build command needed** - the site is ready to serve as-is
- **Local development**: Open `index.html` directly in a browser or use a simple HTTP server
- **Deployment**: Push to Vercel (configured in `vercel.json`)

## Architecture

### File Structure
- `index.html` - Complete website with all HTML, CSS, and JavaScript
- `assets/` - Static assets (fonts, images, logos)
  - `font/allenoire/` - Custom Allenoire font files
  - `img/` - Hero image
  - `logo/` - Logo and favicon
- `package.json` - Dev dependencies only (Tailwind, PostCSS, Autoprefixer)
- `vercel.json` - Vercel deployment configuration

### Design System
- **Colors**: Chocolate (`#592112`), Orange (`#f7710e`), Cream (`#faf0e6`)
- **Typography**: Inter (body), Allenoire (headings/logo)
- **Components**: Custom CSS classes for buttons, cards, forms, timeline items
- **Responsive**: Mobile-first design with Tailwind breakpoints

### Key Features
1. **Fixed header** with scroll effect and mobile menu
2. **Scroll animations** using Intersection Observer API
3. **Smooth scrolling** for anchor links
4. **Responsive design** with mobile navigation
5. **Contact form** (currently commented out in HTML)
6. **Custom font loading** with @font-face

## Deployment

The site is configured for Vercel static hosting:
- All HTML files served via `@vercel/static`
- Assets served from `/assets/` directory
- No server-side processing needed

## Important Notes

1. **No build process**: Tailwind CSS is loaded via CDN, so no CSS compilation is needed
2. **Inline everything**: All CSS and JavaScript is inlined in `index.html`
3. **Custom font**: Allenoire font is loaded locally from `assets/font/allenoire/`
4. **Form disabled**: Contact form is currently commented out (lines 600-633)
5. **Portuguese language**: Content is in Portuguese (pt language tag)

## Development Workflow

1. Edit `index.html` directly
2. Test by opening in browser
3. Commit changes
4. Push to deploy on Vercel

No build step, bundling, or compilation required.