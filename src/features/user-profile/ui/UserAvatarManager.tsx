import React from 'react';

import { User, UserAvatar } from '../../../entities/user';
import { useUserProfile } from '../model';

interface UserAvatarManagerProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
  showUsername?: boolean;
}

const UserAvatarManager: React.FC<UserAvatarManagerProps> = ({
  user,
  size = 'md',
  showUsername = true,
}) => {
  const { openUserProfile } = useUserProfile();

  const handleClick = (userId: number) => {
    openUserProfile(userId);
  };

  return (
    <UserAvatar
      user={user}
      size={size}
      showUsername={showUsername}
      onClick={handleClick}
    />
  );
};

export default UserAvatarManager;