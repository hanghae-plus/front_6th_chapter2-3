import { create } from 'zustand';

interface profileDialogState {
  isModalOpen: boolean;
  userIdToView: number | null;
  openModal: (user: number) => void;
  closeModal: () => void;
}

export const useProfileDialogStore = create<profileDialogState>((set) => ({
  isModalOpen: false,
  userIdToView: null,
  openModal: (id: number) => set({ isModalOpen: true, userIdToView: id }),
  closeModal: () => set({ isModalOpen: false }),
}));
