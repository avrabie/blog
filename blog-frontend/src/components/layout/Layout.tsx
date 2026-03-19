import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { UserInfo } from '../../types/auth';
import { LoginButton } from '../auth/LoginButton';
import { UserBadge } from '../auth/UserBadge';

interface NavbarProps {
  user: UserInfo | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Write', path: '/create-post' },
    { name: 'Chat', path: '/chat' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="glass-card flex items-center px-4 py-2 gap-8 rounded-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary" />
          <span className="font-bold text-lg hidden sm:block">Reactive.Blog</span>
        </Link>

        <div className="flex gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative px-4 py-1.5 text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-neutral-400 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="ml-4">
          {user ? (
            <UserBadge user={user} />
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-white/5 mt-auto">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-neutral-500 text-sm">
          © {new Date().getFullYear()} Reactive Systems Blog. Built with FE: React + Junie; BE: Java + WebFlux.
        </div>
        <div className="flex gap-6">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-white transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  user: UserInfo | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen flex flex-col pt-24">
      <Navbar user={user} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};
