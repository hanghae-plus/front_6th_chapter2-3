import { useModal } from "@/shared/hooks/useModal"

export const useAddPostModal = () => {
  return useModal<void>("addPost")
}
