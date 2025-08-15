import React from 'react';

import { UserModalManager } from '../../../features/user-profile';

const UserProfileWidget: React.FC = () => {
  return (
    <>
      {/* 사용자 프로필 모달 */}
      <UserModalManager />
    </>
  );
};

export default UserProfileWidget;