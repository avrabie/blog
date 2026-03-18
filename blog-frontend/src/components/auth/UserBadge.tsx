import { UserInfo } from '../../types/auth';

interface UserBadgeProps {
  user: UserInfo;
}

export function UserBadge({ user }: UserBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-neutral-400">
        {user.name || user.username}
      </span>
    </div>
  );
}
