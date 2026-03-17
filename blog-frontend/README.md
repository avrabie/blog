# Reactive Systems Blog Frontend

A modern, production-quality React application for a personal technology blog, built with Vite, TypeScript, and TailwindCSS.

## 🚀 Features

- **Reactive Live Updates**: Posts and comments update in real-time using Server Sent Events (SSE).
- **Modern Design**: Clean, dark-mode-first aesthetic inspired by Linear, Vercel, and Stripe.
- **Smooth Animations**: Powered by Framer Motion for page transitions and interactive elements.
- **Infinite Scrolling & Tag Filtering**: Easily discover content.
- **Markdown Support**: High-quality post rendering with code syntax highlighting and copy-to-clipboard.
- **Type-safe API**: Full TypeScript integration for all backend models.
- **Performance Optimized**: Lazy loading, memoized components, and TanStack Query for efficient data management.

## 🛠️ Stack

- **Framework**: React 18+
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0
- **Routing**: React Router
- **Data Fetching**: TanStack React Query + Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Content**: React Markdown

## 🏁 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`. In development, the Vite dev server proxies `/api/blog` (including `/api/blog/sse`) to `http://localhost:8082` so you can run the backend locally. In production, keep the frontend behind the gateway so requests are same-origin under `/api/blog`.

## 📁 Project Structure

```
src/
  api/        # API client and service layer
  components/ # Reusable UI components
  hooks/      # Custom React hooks (SSE, etc.)
  pages/      # Main application pages
  types/      # TypeScript interfaces
  utils.ts    # Utility functions
```
