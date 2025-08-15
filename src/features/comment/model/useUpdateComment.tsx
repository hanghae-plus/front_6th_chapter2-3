import { updateCommentApi } from '@/entities/comment/api/updateComment'
import { CommentsByPost } from '@/entities/comment/model/types'
import { selectedCommentType } from '@/entities/comment/model/types'

export const useUpdateComment = (
  setComments: React.Dispatch<React.SetStateAction<CommentsByPost>>,
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
) => {
  return async (selectedComment: selectedCommentType) => {
    try {
      console.log('Updating comment:', selectedComment)
      const data = await updateCommentApi(selectedComment)
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) =>
          comment.id === data.id ? data : comment
        ),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error('댓글 업데이트 오류:', error)
    }
  }
}
