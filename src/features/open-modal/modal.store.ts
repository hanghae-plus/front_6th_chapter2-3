import { create } from "zustand"

// 모달 타입 정의
export type ModalKey = "addPost" | "editPost" | "detailPost" | "addCommentDialog" | "editCommentDialog" | "userModal"

// 모달 상태 타입 정의
export interface ModalState {
  // 모달 상태들
  modals: Record<ModalKey, boolean>

  // 모달 액션들
  openModal: (key: ModalKey) => void
  closeModal: (key: ModalKey) => void
  toggleModal: (key: ModalKey) => void

  // 모든 모달 닫기
  closeAllModals: () => void
}

// 초기 모달 상태
const initialModalState: Record<ModalKey, boolean> = {
  addPost: false,
  editPost: false,
  detailPost: false,
  addCommentDialog: false,
  editCommentDialog: false,
  userModal: false,
}

// Zustand 스토어 생성
export const useModalStore = create<ModalState>((set) => ({
  // 초기 상태
  modals: initialModalState,

  // 모달 열기
  openModal: (key: ModalKey) =>
    set((state) => ({
      modals: { ...state.modals, [key]: true },
    })),

  // 모달 닫기
  closeModal: (key: ModalKey) =>
    set((state) => ({
      modals: { ...state.modals, [key]: false },
    })),

  // 모달 토글
  toggleModal: (key: ModalKey) =>
    set((state) => ({
      modals: { ...state.modals, [key]: !state.modals[key] },
    })),

  // 모든 모달 닫기
  closeAllModals: () => set({ modals: initialModalState }),
}))
