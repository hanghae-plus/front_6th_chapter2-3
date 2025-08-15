import { useQueryClient } from "@tanstack/react-query"
import { useCommentDialogs } from "../../../../shared/store"
import type { Comments } from "../../../../entities/comments/api/types"
import { useSelectedComment } from "../../model"
import { useUpdateCommentMutation, commentsKeys } from "../../model/queries"

export const useEditComment = () => {
  const { selectedComment, setSelectedComment } = useSelectedComment()
  const { setShowEditCommentDialog } = useCommentDialogs()
  const updateCommentMutation = useUpdateCommentMutation()
  const queryClient = useQueryClient()

  const updateComment = async () => {
    if (!selectedComment) return

    try {
      const { id, body } = selectedComment
      await updateCommentMutation.mutateAsync({ id, body })
      
      // 성공 시 처리
      setShowEditCommentDialog(false)
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(selectedComment.postId) })
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(selectedComment.postId) })
    }
  }

  const editPostComment = (comment: Comments) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return { 
    updateComment, 
    editPostComment,
    isUpdating: updateCommentMutation.isPending
  }
}
