import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { UserInfo } from '../../types/auth';

interface UserBadgeProps {
  user: UserInfo;
}

export function UserBadge({ user }: UserBadgeProps) {
  return (
    <Link
      to="/profile"
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
    >
      <User size={16} className="text-brand-primary" />
      <span className="text-sm text-neutral-300">
        {user.name || user.username}
      </span>
    </Link>
  );
}
