import { create } from 'zustand';
import { UserDetail } from './type';

interface UserState {
  selectedUser: UserDetail | null;
  setSelectedUser: (user: UserDetail | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
