import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Shield, Mail } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { getUserProfile } from '../api/profile';
import { UserProfile } from '../types/auth';

export const Profile: React.FC = () => {
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: getUserProfile,
  });

  const user = profile as UserProfile | undefined;
  const claims = user?.credentials?.claims;

  return (
    <div className="py-20 space-y-8">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl md:text-6xl font-extrabold tracking-tighter"
      >
        My <span className="gradient-text">Profile</span>
      </motion.h1>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {error && (
        <Card className="p-6 text-center">
          <p className="text-red-400">Failed to load profile</p>
        </Card>
      )}

      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
                <User size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{claims?.name || `${claims?.given_name} ${claims?.family_name}`}</h2>
                <p className="text-neutral-400">@{claims?.preferred_username}</p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-neutral-400">
                <User size={18} />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <p className="text-lg">{claims?.given_name} {claims?.family_name}</p>
            </Card>

            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-neutral-400">
                <Mail size={18} />
                <span className="text-sm font-medium">Username</span>
              </div>
              <p className="text-lg">{claims?.preferred_username}</p>
            </Card>
          </div>

          <Card className="p-6 space-y-3">
            <div className="flex items-center gap-2 text-neutral-400">
              <Shield size={18} />
              <span className="text-sm font-medium">Roles & Permissions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.authorities?.map((auth, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-brand-primary/20 text-brand-primary text-sm"
                >
                  {auth.authority.replace('ROLE_', '')}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
