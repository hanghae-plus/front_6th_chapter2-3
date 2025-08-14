import { create } from 'zustand';

import { User } from '@/entities/user/model/types';

interface profileDialogState {
  isModalOpen: boolean;
  userToView: User | null;
  openModal: (user: User) => void;
  closeModal: () => void;
}

export const useProfileDialogStore = create<profileDialogState>((set) => ({
  isModalOpen: false,
  userToView: null,
  openModal: (user: User) => set({ isModalOpen: true, userToView: user }),
  closeModal: () => set({ isModalOpen: false }),
}));
