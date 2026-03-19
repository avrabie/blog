import React, { Suspense, Component, ErrorInfo, ReactNode, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';
import { About } from './pages/About';
import { CreatePost } from './pages/CreatePost';
import { EditPost } from './pages/EditPost';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { Layout } from './components/layout/Layout';
import { Skeleton } from './components/ui/Skeleton';
import { UserInfo } from './types/auth';

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
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch('/api/bff/me')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Not authenticated');
      })
      .then((data: UserInfo) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout user={user}>
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
                <Route path="/profile" element={<Profile />} />
                <Route path="/chat" element={<Chat user={user} />} />
                <Route path="/create-post" element={<CreatePost user={user} />} />
                <Route path="/edit-post/:slug" element={<EditPost user={user} />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
