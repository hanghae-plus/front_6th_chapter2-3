import { create } from 'zustand';

interface UserModalState {
  opened: boolean;
  userId: number | null;
  open: (userId: number) => void;
  close: () => void;
}

export const useUserModal = create<UserModalState>((set) => {
  return {
    opened: false,
    userId: null,
    open: (userId: number) => {
      set({ opened: true, userId });
    },
    close: () => {
      set({ opened: false, userId: null });
    },
  };
});
