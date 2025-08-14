import { create } from "zustand"

export enum DialogType {
  ADD_POST = "addPost",
  EDIT_POST = "editPost",
  ADD_COMMENT = "addComment",
  EDIT_COMMENT = "editComment",
  POST_DETAIL = "postDetail",
  USER_MODAL = "userModal",
}

interface DialogStore {
  currentDialog: DialogType | null
  openDialog: (type: DialogType) => void
  closeDialog: () => void
  resetStore: () => void
}

export const useDialogStore = create<DialogStore>((set) => ({
  currentDialog: null,
  openDialog: (type: DialogType) => set({ currentDialog: type }),
  closeDialog: () => set({ currentDialog: null }),
  resetStore: () => set({ currentDialog: null }),
}))
