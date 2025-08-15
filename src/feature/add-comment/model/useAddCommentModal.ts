import { useModal } from "@/shared/hooks/useModal"

export interface AddCommentData {
  postId: number
}

export const useAddCommentModal = () => {
  return useModal<AddCommentData>("addComment")
}
