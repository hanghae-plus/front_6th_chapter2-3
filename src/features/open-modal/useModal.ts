import { useModalStore, type ModalKey } from "./modal.store"

// 키값으로 모달을 선택하는 메인 훅
export const useModal = (key: ModalKey) => {
  const store = useModalStore()

  return {
    // 모달 상태
    isOpen: store.modals[key],

    // 모달 액션들
    open: () => store.openModal(key),
    close: () => store.closeModal(key),
    toggle: () => store.toggleModal(key),
  }
}

// 편의를 위한 전체 모달 관리 훅
export const useModalManager = () => {
  const store = useModalStore()

  return {
    // 모든 모달 상태
    modals: store.modals,

    // 전체 모달 관리 액션
    openModal: store.openModal,
    closeModal: store.closeModal,
    toggleModal: store.toggleModal,
    closeAllModals: store.closeAllModals,
  }
}
