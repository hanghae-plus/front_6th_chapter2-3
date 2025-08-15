import { useUserStore } from '../store';
import { User } from '../../../entities/user';
import { useUser } from './useUserQueries';

export const useUserFeature = () => {
  // Zustand 스토어 사용 (클라이언트 상태)
  const { user, setUser, clearUser, showUserModal, setShowUserModal } = useUserStore();

  // TanStack Query 훅 사용
  const { data: userData, isLoading, error } = useUser(user?.id || 0);

  const openUserModal = async (user: User | undefined) => {
    if (!user || !user.id) {
      console.warn('사용자 정보가 없습니다:', user);
      return;
    }

    // TanStack Query가 자동으로 사용자 데이터를 가져옴
    // useUser(user.id) 훅이 자동으로 작동
    setUser(user);
    setShowUserModal(true);
  };

  // TanStack Query 데이터를 우선적으로 사용
  const currentUser = userData || user;

  // 기존 반환값과 동일 (변경 없음)
  return {
    // 상태 (TanStack Query 데이터 우선)
    showUserModal,
    user: currentUser,
    // TanStack Query 상태 추가
    isLoading,
    error,
    // 상태 설정자
    setShowUserModal,
    setUser,
    clearUser,
    // 함수들
    openUserModal,
  };
};
