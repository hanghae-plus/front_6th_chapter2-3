import { Post } from "@/entities/post"
import { useModal } from "@/shared/hooks/useModal"

export const usePostDetailModal = () => {
  return useModal<Post>("postDetail")
}
