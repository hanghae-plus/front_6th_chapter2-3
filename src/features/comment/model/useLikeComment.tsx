// features/comment/like/model/useLikeComment.ts
import { likeCommentApi } from '@/entities/comment/api/likeComment'
import { CommentsByPost } from '@/entities/comment/model/types'

export const useLikeComment = (
  comments: CommentsByPost,
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>
) => {
  return async (id: number, postId: number) => {
    try {
      const comment = comments[postId].find((c) => c.id === id)
      if (!comment) return

      const data = await likeCommentApi(id, comment.likes)

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((c) =>
          c.id === data.id ? { ...c, likes: c.likes + 1 } : c
        ),
      }))
    } catch (error) {
      console.error('댓글 좋아요 오류:', error)
    }
  }
}
