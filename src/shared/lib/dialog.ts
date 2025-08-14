import { create } from "zustand"

export enum DialogType {
  ADD_POST = "addPost",
  EDIT_POST = "editPost",
  ADD_COMMENT = "addComment",
  EDIT_COMMENT = "editComment",
  POST_DETAIL = "postDetail",
  USER_MODAL = "userModal",
}

interface State {
  currentDialog: DialogType | null
}

interface Actions {
  actions: {
    openDialog: (type: DialogType) => void
    closeDialog: () => void
    resetState: () => void
  }
}

const initialState: State = {
  currentDialog: null,
}

export const useDialogStore = create<State & Actions>((set) => ({
  ...initialState,
  actions: {
    openDialog: (type: DialogType) => set({ currentDialog: type }),
    closeDialog: () => set({ currentDialog: null }),
    resetState: () => set(initialState),
  },
}))
