import { useUpdateComment } from "../../../entities/comment/model/hooks"
import { UpdateComment } from "../../../entities/comment/model/types"

export const useUpdateCommentFeature = () => {
  const updateCommentMutation = useUpdateComment()

  const updateComment = async (id: number, comment: UpdateComment, postId: number) => {
    try {
      await updateCommentMutation.mutateAsync({ id, comment, postId })
      return { success: true }
    } catch (error) {
      console.error("댓글 수정 오류:", error)
      return { success: false, error }
    }
  }

  return {
    updateComment,
    isLoading: updateCommentMutation.isPending,
    error: updateCommentMutation.error,
  }
}
