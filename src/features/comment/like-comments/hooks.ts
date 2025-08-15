import { useMutation } from "@tanstack/react-query"
import CommentAPI from "../../../entities/comment/api/CommentAPI"

export const useLikeCommentFeature = () => {
  const likeCommentMutation = useMutation({
    mutationFn: (id: number) => CommentAPI.likeComment(id),
    // invalidateQueries 제거 - setQueryData로 직접 캐시 업데이트
  })

  const likeComment = async (id: number) => {
    try {
      await likeCommentMutation.mutateAsync(id)
      return { success: true }
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      return { success: false, error }
    }
  }

  return {
    likeComment,
    isLoading: likeCommentMutation.isPending,
    error: likeCommentMutation.error,
  }
}
