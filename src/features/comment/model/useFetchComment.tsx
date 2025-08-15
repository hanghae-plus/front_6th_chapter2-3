import { fetchCommentApi } from '@/entities/comment/api/fetchComment'
import { CommentsByPost } from '@/entities/comment/model/types'
export const useFetchComment = (
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>,
  comments: CommentsByPost
) => {
  return async (postId: number) => {
    if (comments[postId]) return
    try {
      const data = await fetchCommentApi(postId)
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error('댓글 가져오기 오류:', error)
    }
  }
}
