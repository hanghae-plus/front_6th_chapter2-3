import { create } from 'zustand';

import { User, userApi } from '../../../entities/user';

interface UserProfileState {
  selectedUser: User | null;
  showUserModal: boolean;
  loading: boolean;
}

interface UserProfileActions {
  openUserProfile: (userId: number) => Promise<void>;
  closeUserProfile: () => void;
  setShowUserModal: (show: boolean) => void;
  setSelectedUser: (user: User | null) => void;
}

export const useUserProfile = create<UserProfileState & UserProfileActions>((set) => ({
  selectedUser: null,
  showUserModal: false,
  loading: false,

  openUserProfile: async (userId: number) => {
    set({ loading: true });
    try {
      const userData = await userApi.getUser(userId);
      set({ 
        selectedUser: userData, 
        showUserModal: true, 
        loading: false 
      });
    } catch (error: any) {
      console.error('사용자 정보 가져오기 오류:', error);
      set({ loading: false });
    }
  },

  closeUserProfile: () => set({ 
    showUserModal: false, 
    selectedUser: null 
  }),

  setShowUserModal: (show: boolean) => set({ showUserModal: show }),
  setSelectedUser: (user: User | null) => set({ selectedUser: user }),
}));