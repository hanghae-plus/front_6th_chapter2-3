// src/features/users/model/userModalStore.ts
import { create } from 'zustand';
import { PostAuthor } from '@/entities/posts';

interface UserModalState {
  showUserModal: boolean;
  selectedUser: PostAuthor | null;
  openUserModal: (user: PostAuthor) => void;
  closeUserModal: () => void;
}

export const useUserModalStore = create<UserModalState>((set) => ({
  showUserModal: false,
  selectedUser: null,
  openUserModal: (user) =>
    set({
      showUserModal: true,
      selectedUser: user,
    }),
  closeUserModal: () =>
    set({
      showUserModal: false,
      selectedUser: null,
    }),
}));
