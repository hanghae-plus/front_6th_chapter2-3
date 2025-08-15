import { addCommentApi } from '@/entities/comment/api/addComment'
import { NewComment, CommentsByPost } from '@/entities/comment/model/types'

export const useAddComment = (
  newComment: NewComment,
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>,
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>,
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  //함수의 매개변수를 직접 받았으므로, 따로 지정하지 않고 빈 상태로 작성
  return async () => {
    try {
      const data = await addCommentApi(newComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: '', postId: null, userId: 1 })
    } catch (error) {
      console.error('댓글 추가 오류:', error)
    }
  }
}
