import { User } from '../../../entities/user';
import * as userAPI from '../../../entities/user/api';

// 상태 관리와 결합된 API 로직
export const useUserAPI = () => {
  // 사용자 정보 가져오기
  const fetchUserWithState = async (
    userId: number,
    setUser: (user: User) => void,
    setShowUserModal: (show: boolean) => void,
  ) => {
    try {
      const userData = await userAPI.fetchUser(userId);
      setUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  return {
    fetchUserWithState,
  };
};
