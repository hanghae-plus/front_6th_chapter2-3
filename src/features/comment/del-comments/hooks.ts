import { useMutation } from "@tanstack/react-query"
import CommentAPI from "../../../entities/comment/api/CommentAPI"

export const useDeleteCommentFeature = () => {
  const deleteCommentMutation = useMutation({
    mutationFn: (id: number) => CommentAPI.deleteComment(id),
    // invalidateQueries 제거 - setQueryData로 직접 캐시 업데이트
  })

  const deleteComment = async (id: number) => {
    try {
      await deleteCommentMutation.mutateAsync(id)
      return { success: true }
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      return { success: false, error }
    }
  }

  return {
    deleteComment,
    isLoading: deleteCommentMutation.isPending,
    error: deleteCommentMutation.error,
  }
}
