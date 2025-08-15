import { create } from 'zustand';
import { User } from '../../../shared/types/common';

interface UserStore {
  // 기존 useState로 관리되던 상태들
  user: User | null;
  showUserModal: boolean;

  // 기존 setState 함수들
  setUser: (user: User) => void;
  clearUser: () => void;
  setShowUserModal: (show: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  // 기존 초기값과 동일
  user: null,
  showUserModal: false,

  // 기존 setState 함수들과 동일한 동작
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setShowUserModal: (show) => set({ showUserModal: show }),
}));
