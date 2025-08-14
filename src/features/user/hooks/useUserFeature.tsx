import { useUserStore } from '../store';
import { User } from '../../../entities/user';
import { fetchUser } from '../../../entities/user';

export const useUserFeature = () => {
  // Zustand 스토어 사용 (기존 useState와 동일한 기능)
  const { user, setUser, clearUser, showUserModal, setShowUserModal } = useUserStore();

  // 기존 함수들 (변경 없음)
  const openUserModal = async (user: User | undefined) => {
    if (!user || !user.id) {
      console.warn('사용자 정보가 없습니다:', user);
      return;
    }
    await fetchUser(user.id, setUser, setShowUserModal);
  };

  // 기존 반환값과 동일 (변경 없음)
  return {
    // 상태
    showUserModal,
    user,
    // 상태 설정자
    setShowUserModal,
    setUser,
    clearUser,
    // 함수들
    openUserModal,
  };
};
