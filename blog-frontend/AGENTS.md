# AGENTS.md

This document provides guidelines for AI coding agents working in this blog frontend repository.

## Project Overview

- **Type**: React + TypeScript frontend application
- **Build Tool**: Vite
- **UI Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS variables and glass morphism design
- **State/Data**: TanStack React Query for server state management
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **API Client**: Axios with SSE support for real-time updates

## Build/Lint/Test Commands

```bash
# Development
npm run dev          # Start Vite dev server with hot reload

# Production
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint on all files
```

### Single File/Component Development

To test or lint a specific file, use ESLint directly:
```bash
npx eslint src/components/ui/Card.tsx
```

For TypeScript checking a single file:
```bash
npx tsc --noEmit src/pages/Home.tsx
```

## Code Style Guidelines

### Formatting

- **Print Width**: 100 characters
- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Trailing Commas**: All (ES5+)
- **Quotes**: Single quotes for strings
- Run `npm run lint` before committing - ESLint enforces formatting

### TypeScript Conventions

1. **Explicit Types**: Always use explicit types for function parameters and return values:
   ```typescript
   // Good
   export const Card: React.FC<CardProps> = ({ children, className }) => { ... }
   
   // Avoid implicit any
   function processData(data: unknown) { ... }
   ```

2. **Interfaces over Types**: Prefer `interface` for object shapes, use `type` for unions/primitives:
   ```typescript
   interface Post {
     id: string;
     title: string;
   }
   
   type Status = 'draft' | 'published' | 'archived';
   ```

3. **Null Handling**: Use optional chaining and nullish coalescing:
   ```typescript
   const title = post?.title ?? 'Untitled';
   ```

### Component Patterns

1. **File Naming**: PascalCase for components, camelCase for utilities/hooks
2. **Component Export**: Named exports preferred for components
3. **Props Interface**: Define props interface above the component
4. **FC with Generic**: Use `React.FC<Props>` for typed props

```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = true }) => {
  return <motion.div className={cn("glass-card", className)}>{children}</motion.div>;
};
```

### Import Organization

Organize imports in this order (enforced by ESLint config):

1. React core imports
2. External libraries (react-router, tanstack-query, etc.)
3. Internal components/utils
4. Type imports

```typescript
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from './components/ui/Card';
import { Post } from './types';
```

### CSS/Tailwind Conventions

1. **CSS Variables**: Define design tokens in `src/index.css` under `@theme`
2. **Glass Effects**: Use `.glass-card` and `.glass-button` component classes
3. **Color Scheme**: Brand primary `#aa3bff`, secondary `#c084fc`, background `#0a0a0a`
4. **Custom Classes**: Use Tailwind's `@apply` in `@layer components`

```css
@layer components {
  .glass-card {
    @apply bg-[var(--card-bg)] border border-[var(--card-border)] backdrop-blur-md rounded-xl;
  }
}
```

### API Patterns

1. **Axios Client**: Use the configured `apiClient` from `src/api/client.ts`
2. **SSE Connections**: Use `createSSEConnection` from `src/api/sse.ts` for real-time updates
3. **Error Handling**: Always wrap async operations in try-catch

```typescript
import apiClient from '../api/client';

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiClient.get<Post[]>('/posts');
  return response.data;
};
```

### React Query Patterns

1. **Query Keys**: Use string arrays for query keys
2. **Stale Time**: 5 minutes default for most queries
3. **Dev Mode**: Disable retries in development for faster debugging

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: getPosts,
});
```

### Error Handling

1. **Error Boundaries**: Use the `ErrorBoundary` class component in `App.tsx` for component-level errors
2. **Console Logging**: Use descriptive prefixes in dev mode
3. **User Feedback**: Show user-friendly error messages with fallback UI

```typescript
console.log('[usePostStream] Processing new post:', newPost);
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `PostCard`, `CommentSection` |
| Hooks | camelCase with `use` prefix | `usePostStream`, `useCommentStream` |
| Utilities | camelCase | `cn`, `formatDate` |
| Types/Interfaces | PascalCase | `Post`, `Comment` |
| Files | PascalCase for components, camelCase for utils | `Card.tsx`, `utils.ts` |
| CSS Classes | kebab-case with Tailwind | `text-center`, `glass-card` |

## File Structure

```
src/
├── api/           # API clients and SSE connections
│   ├── client.ts
│   ├── comments.ts
│   ├── posts.ts
│   └── sse.ts
├── components/
│   ├── blog/      # Blog-specific components
│   ├── layout/    # Layout components
│   └── ui/        # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components (routes)
├── types/         # TypeScript interfaces and types
├── App.tsx        # Main app with routing
├── main.tsx       # Entry point
├── index.css      # Global styles and Tailwind config
└── utils.ts       # Utility functions
```

## Common Tasks

### Adding a New API Endpoint

1. Add the API function in the appropriate file under `src/api/`
2. Export the type if needed in `src/types/index.ts`
3. Create a React Query hook in `src/hooks/` if used with query

### Creating a New Component

1. Create file in appropriate directory under `src/components/`
2. Define props interface above component
3. Use `cn()` utility for conditional classes
4. Add motion effects with framer-motion for interactivity

### Modifying Styles

1. **Tailwind Classes**: Use inline in JSX
2. **CSS Variables**: Add to `src/index.css` under `:root`
3. **Custom Components**: Add to `@layer components` in `index.css`
