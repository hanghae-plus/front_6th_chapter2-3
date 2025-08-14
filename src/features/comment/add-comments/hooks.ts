import { useCreateComment } from "../../../entities/comment/model/hooks"
import { CreateComment } from "../../../entities/comment/model/types"

export const useAddComment = () => {
  const createCommentMutation = useCreateComment()

  const addComment = async (comment: CreateComment) => {
    try {
      await createCommentMutation.mutateAsync(comment)
      return { success: true }
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      return { success: false, error }
    }
  }

  return {
    addComment,
    isLoading: createCommentMutation.isPending,
    error: createCommentMutation.error,
  }
}
