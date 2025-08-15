import { Post } from "@/entities/post"
import { useModal } from "@/shared/hooks/useModal"

export const useUpdatePostModal = () => {
  return useModal<Post>("updatePost")
}
