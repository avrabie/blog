Just created a react with typescript in the blog-frontend directory.
You are an expert frontend engineer. Build a modern, production-quality React application using **Vite + TypeScript** for a **personal technology blog frontend** that connects to a **Java Spring Boot backend using WebFlux**.

## Core Requirements

### Stack

Use the following technologies:

* React 18+
* Vite
* TypeScript
* React Router
* TanStack React Query
* TailwindCSS
* Framer Motion (for animations)
* Axios
* Server Sent Events (EventSource) for streaming


Follow modern best practices for maintainability and scalability.

---

# Application Purpose

The frontend is for a **personal technology blog** focused on topics like:

* Java
* Spring / WebFlux
* Reactive systems
* Distributed systems
* Backend architecture

The design should feel **clean, modern, and developer-focused**, similar in spirit to:

* Linear.app design
* Vercel blog
* Stripe documentation style

Dark mode should be the default.

---

# Backend Integration

The backend is written in **Java with Spring WebFlux**, meaning it supports **reactive streaming**.

The frontend must support **live streaming updates** for:

* Posts
* Comments

Use **Server Sent Events (EventSource)** to consume streams.
the endpoints can be found in BlogRoutes
```java

@Bean
public RouterFunction<ServerResponse> routes(PostHandler postHandler, CommentHandler commentHandler) {
    return RouterFunctions.route()
            .GET("/posts/{slug}/comments", commentHandler::getCommentsByPostSlug)
            .POST("/posts/{slug}/comments", commentHandler::addComment)
            .PUT("/posts/{slug}/comments/{id}", commentHandler::updateComment)
            .DELETE("/posts/{slug}/comments/{id}", commentHandler::deleteComment)
            .GET("/posts", postHandler::getAllPosts)
            .POST("/posts", postHandler::createPost)
            .GET("/posts/{slug}", postHandler::getPostBySlug)
            .PUT("/posts/{slug}", postHandler::updatePost)
            .DELETE("/posts/{slug}", postHandler::deletePost)
            .build();
}

// these endpoints are for SSE
@Bean
public RouterFunction<ServerResponse> sseRoutes(CommentHandler commentHandler) {
    return RouterFunctions.route()
            .GET("/sse/posts/{slug}/comments/stream", commentHandler::streamComments)
            .GET("/sse/posts/stream", commentHandler::streamPosts)
            .build();
}
```
Streaming endpoints send updates whenever a new post or comment appears.

Implement a reusable **SSE service layer**.

The stream service should expose hooks like:

usePostStream()
useCommentStream(postId)

These hooks should update React Query caches when new events arrive.

---

# UI Pages

Implement the following pages:

### Home Page

Displays list of blog posts.

Features:

* Beautiful post cards
* Author
* Date
* Reading time
* Tags
* Animated hover effects
* Smooth entrance animations
* Infinite scrolling

Posts should update automatically if a new one appears in the stream.

---

### Post Detail Page

Displays:

* Title
* Subtitle
* Author info
* Publication date
* Blog content
* Code blocks with syntax highlighting
* Comments section

Comments must update **live via stream**.
Assume the Blog Content will be in .md format
---

### About Page

Short personal bio:

* Technologies used
* Links to GitHub / LinkedIn
* Minimal developer aesthetic

---

# UI / UX Design

Design must feel **premium and modern**.

Use:

* Glassmorphism cards
* Soft gradients
* Subtle hover effects
* Smooth page transitions
* Framer Motion animations
* Good typography

Typography suggestions:

* Inter
* JetBrains Mono (for code blocks)

Use Tailwind for styling.

---


Example components:

PostCard
PostHeader
CommentList
CommentItem
StreamingIndicator
Navbar
Footer

---

# Performance

Implement:


* Suspense boundaries where appropriate
* Lazy loaded routes
* Memoized components where useful

Streaming updates should **not cause full page re-renders**.

---

# Animations

Use Framer Motion for:

* Page transitions
* Post card hover effects
* Comment appearance animations
* Streamed content fade-in

Animations should feel smooth and subtle, not distracting.

---

# Developer Experience

Include:

* Prettier
* Type-safe API models
* Environment variables for API base URL
* Vite proxy support

.env example:

VITE_API_URL=http://localhost:8080/api

---

# Bonus Features

If possible implement:

* Reading progress bar
* Copy-to-clipboard button for code blocks
* Tag filtering
* Skeleton loading states
* Smooth scroll behavior

---

# Expected Output

Generate:

1. Full Vite React project
2. All pages and components
3. API service layer
4. SSE streaming implementation
5. Tailwind configuration
6. Clean modern UI
7. Type definitions for API responses

Focus on **clean architecture, reusability, and excellent UI design**.

The project should run with:

npm install
npm run dev

The result should feel like a **modern developer blog similar to Vercel or Stripe engineering blogs**, but focused on reactive backend technologies.
