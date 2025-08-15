import { CommentsByPost } from '@/entities/comment/model/types'
import { deleteCommentApi } from '@/entities/comment/api/deleteComment'
export const useDeleteComment = (
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>
) => {
  return async (id: number, postId: number) => {
    try {
      await deleteCommentApi(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error('댓글 삭제 오류:', error)
    }
  }
}
