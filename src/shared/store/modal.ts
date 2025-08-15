import { create } from "zustand"

interface ModalState {
  closeAllModals: () => void

  closeModal: (modalId: string) => void
  getModalData: <T = unknown>(modalId: string) => T | undefined
  isModalOpen: (modalId: string) => boolean
  modals: Record<
    string,
    {
      data?: unknown
      isOpen: boolean
    }
  >
  openModal: (modalId: string, data?: unknown) => void
}

export const useModalStore = create<ModalState>((set, get) => ({
  closeAllModals: () => {
    set({ modals: {} })
  },

  closeModal: (modalId) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: {
          data: undefined,
          isOpen: false,
        },
      },
    }))
  },

  getModalData: <T>(modalId: string) => {
    return get().modals[modalId]?.data as T
  },

  isModalOpen: (modalId) => {
    return get().modals[modalId]?.isOpen ?? false
  },

  modals: {},

  openModal: (modalId, data) => {
    set((state) => ({
      modals: {
        ...state.modals,
        [modalId]: {
          data,
          isOpen: true,
        },
      },
    }))
  },
}))
