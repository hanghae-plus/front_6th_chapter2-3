import { User } from '../types';

// PostsManagerPage.tsx에서 그대로 복사한 User 관련 함수들
// 사용자 정보 가져오기
export const fetchUser = async (
  userId: number,
  setSelectedUser: (user: User) => void,
  setShowUserModal: (show: boolean) => void,
) => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    setSelectedUser(userData);
    setShowUserModal(true);
  } catch (error) {
    console.error('사용자 정보 가져오기 오류:', error);
  }
};
