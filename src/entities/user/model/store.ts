import { create } from 'zustand';

interface UserState {
  selectedUser: any | null;
  setSelectedUser: (user: any | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
