import React from 'react';

import { UserModal } from '../../../entities/user';
import { useUserProfile } from '../model';

const UserModalManager: React.FC = () => {
  const {
    selectedUser,
    showUserModal,
    setShowUserModal,
  } = useUserProfile();

  return (
    <UserModal
      isOpen={showUserModal}
      onOpenChange={setShowUserModal}
      user={selectedUser}
    />
  );
};

export default UserModalManager;