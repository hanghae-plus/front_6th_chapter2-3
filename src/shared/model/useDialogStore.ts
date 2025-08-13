import { create } from "zustand"

interface DialogState {
  dialogs: {
    ADD: boolean
    EDIT: boolean
    ADD_COMMENT: boolean
    EDIT_COMMENT: boolean
    POST_DETAIL: boolean
    USER_INFO: boolean
  }
}

type DialogAction =
  | { type: "SHOW_DIALOG"; dialog: keyof DialogState["dialogs"] }
  | { type: "HIDE_DIALOG"; dialog: keyof DialogState["dialogs"] }
  | { type: "TOGGLE_DIALOG"; dialog: keyof DialogState["dialogs"] }
  | { type: "HIDE_ALL_DIALOGS" }

const dialogReducer = (state: DialogState, action: DialogAction): DialogState => {
  switch (action.type) {
    case "SHOW_DIALOG":
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.dialog]: true,
        },
      }

    case "HIDE_DIALOG":
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.dialog]: false,
        },
      }

    case "TOGGLE_DIALOG":
      return {
        ...state,
        dialogs: {
          ...state.dialogs,
          [action.dialog]: !state.dialogs[action.dialog],
        },
      }

    case "HIDE_ALL_DIALOGS":
      return {
        ...state,
        dialogs: {
          ADD: false,
          EDIT: false,
          ADD_COMMENT: false,
          EDIT_COMMENT: false,
          POST_DETAIL: false,
          USER_INFO: false,
        },
      }

    default:
      return state
  }
}

export const useDialogStore = create<
  DialogState & {
    dispatch: (action: DialogAction) => void
  }
>((set) => ({
  dialogs: {
    ADD: false,
    EDIT: false,
    ADD_COMMENT: false,
    EDIT_COMMENT: false,
    POST_DETAIL: false,
    USER_INFO: false,
  },
  dispatch: (action) => set((state) => dialogReducer(state, action)),
}))

// 편의 함수들
export const useDialogActions = () => {
  const dispatch = useDialogStore((state) => state.dispatch)

  return {
    showDialog: (dialog: keyof DialogState["dialogs"]) => dispatch({ type: "SHOW_DIALOG", dialog }),
    hideDialog: (dialog: keyof DialogState["dialogs"]) => dispatch({ type: "HIDE_DIALOG", dialog }),
    toggleDialog: (dialog: keyof DialogState["dialogs"]) => dispatch({ type: "TOGGLE_DIALOG", dialog }),
    hideAllDialogs: () => dispatch({ type: "HIDE_ALL_DIALOGS" }),
  }
}
