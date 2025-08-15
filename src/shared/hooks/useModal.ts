import { useModalStore } from "@/shared/store/modal"

export const useModal = <T = unknown>(modalId: string) => {
  const { closeModal, getModalData, isModalOpen, openModal } = useModalStore()

  const open = (data?: T) => openModal(modalId, data)
  const close = () => closeModal(modalId)
  const isOpen = isModalOpen(modalId)
  const data = getModalData<T>(modalId)

  return {
    close,
    data,
    isOpen,
    open,
  }
}
