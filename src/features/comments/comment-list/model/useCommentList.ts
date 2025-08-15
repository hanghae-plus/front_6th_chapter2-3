import { useQueryClient } from "@tanstack/react-query"
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
  commentsKeys
} from "../../model/queries"

export const useCommentList = () => {
  const queryClient = useQueryClient()
  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()

  const fetchComments = (postId: number) => {
    // React Query의 useCommentsQuery를 직접 사용하도록 변경됨
    // 이 함수는 더 이상 필요하지 않지만 호환성을 위해 유지
    queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) })
  }

  const deletePostComment = async (commentId: number, postId: number) => {
    try {
      await deleteCommentMutation.mutateAsync(commentId)
      
      // 성공 시 처리
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) })
    }
  }

  const likeComment = async (commentId: number, postId: number) => {
    try {
      // 현재 댓글 데이터를 가져와서 likes 계산
      const currentComments = queryClient.getQueryData(commentsKeys.list(postId)) as any[]
      const currentComment = currentComments?.find(c => c.id === commentId)
      const newLikes = currentComment ? currentComment.likes + 1 : 1

      await likeCommentMutation.mutateAsync({ commentId, likes: newLikes })
      
      // 성공 시 처리
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(postId) })
    }
  }

  return {
    fetchComments,
    deletePostComment,
    likeComment,
    isDeleting: deleteCommentMutation.isPending,
    isLiking: likeCommentMutation.isPending,
  }
}
