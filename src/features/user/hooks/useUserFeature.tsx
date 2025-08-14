import { useState } from 'react';
import { User } from '../../../entities/user';
import { fetchUser } from '../../../entities/user';

export const useUserFeature = () => {
  // User 관련 상태 (PostsManagerPage.tsx에서 그대로 복사)
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // 사용자 모달 열기 (PostsManagerPage.tsx에서 그대로 복사)
  const openUserModal = async (user: User) => {
    await fetchUser(user.id, setSelectedUser, setShowUserModal);
  };

  return {
    // 상태
    showUserModal,
    selectedUser,
    // 상태 설정자
    setShowUserModal,
    setSelectedUser,
    // 함수들
    openUserModal,
  };
};
