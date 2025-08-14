import { create } from 'zustand';
import { DialogState } from '../types/dialog';

export const useDialogStore = create<DialogState>((set, get) => ({
  dialogs: {},

  openDialog: (key: string) => {
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: true },
    }));
  },

  closeDialog: (key: string) => {
    set((state) => ({
      dialogs: { ...state.dialogs, [key]: false },
    }));
  },

  isDialogOpen: (key: string) => {
    return get().dialogs[key] || false;
  },

  toggleDialog: (key: string) => {
    const isOpen = get().isDialogOpen(key);
    if (isOpen) {
      get().closeDialog(key);
    } else {
      get().openDialog(key);
    }
  },
}));
