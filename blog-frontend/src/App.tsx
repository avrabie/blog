import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { About } from './pages/About';
import { CreatePost } from './pages/CreatePost';
import { EditPost } from './pages/EditPost';
import { Layout } from './components/layout/Layout';
import { Skeleton } from './components/ui/Skeleton';

// Simple Error Boundary for the whole app
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Something went wrong</h2>
          <p className="text-neutral-400 mb-8 max-w-md">
            The application encountered an unexpected error. 
            Check the console for details.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="glass-button text-brand-primary"
          >
            Reload Page
          </button>
          {import.meta.env.DEV && (
            <pre className="mt-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left text-xs text-red-400 overflow-auto max-w-2xl">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: import.meta.env.DEV ? false : 3, // Disable retries in dev for faster debugging
    },
  },
});

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Suspense fallback={
              <div className="py-20 space-y-8">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-96 w-full" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/posts/:slug" element={<PostDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/edit-post/:slug" element={<EditPost />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
