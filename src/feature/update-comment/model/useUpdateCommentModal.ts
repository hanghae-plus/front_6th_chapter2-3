import { Comment } from "@/entities/comment"
import { useModal } from "@/shared/hooks/useModal"

export const useUpdateCommentModal = () => {
  return useModal<Comment>("updateComment")
}
