import { useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from "../../entities/comment/model/queries"

// 댓글 관련 mutations를 관리하는 커스텀 훅
export const useCommentMutations = (postId: number) => {
  const addCommentMutation = useAddComment()
  const updateCommentMutation = useUpdateComment(postId || 0)
  const deleteCommentMutation = useDeleteComment(postId || 0)
  const likeCommentMutation = useLikeComment(postId || 0)

  return {
    addCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
    likeCommentMutation,
  }
}
