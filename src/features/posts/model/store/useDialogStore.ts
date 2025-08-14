import { create } from 'zustand';

interface DialogState {
  showAddDialog: boolean;
  showEditDialog: boolean;
  showDetailDialog: boolean;

  setShowAddDialog: (show: boolean) => void;
  setShowEditDialog: (show: boolean) => void;
  setShowDetailDialog: (show: boolean) => void;
}

export const useDialogStore = create<DialogState>((set) => ({
  showAddDialog: false,
  showEditDialog: false,
  showDetailDialog: false,

  setShowAddDialog: (show) => set({ showAddDialog: show }),
  setShowEditDialog: (show) => set({ showEditDialog: show }),
  setShowDetailDialog: (show) => set({ showDetailDialog: show }),
}));
