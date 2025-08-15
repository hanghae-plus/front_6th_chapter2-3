import { useQueryClient } from "@tanstack/react-query"
import { useCommentDialogs } from "../../../../shared/store"
import { useNewComment } from "../../model"
import { useAddCommentMutation, commentsKeys } from "../../model/queries"

export const useAddComment = () => {
  const { newComment, setNewComment } = useNewComment()
  const { setShowAddCommentDialog } = useCommentDialogs()
  const addCommentMutation = useAddCommentMutation()
  const queryClient = useQueryClient()

  const addComment = async () => {
    if (!newComment.postId) return
    
    try {
      await addCommentMutation.mutateAsync(newComment)
      
      // 성공 시 처리
      setNewComment({ body: "", postId: null, userId: 1 })
      setShowAddCommentDialog(false)
      queryClient.invalidateQueries({ queryKey: commentsKeys.list(newComment.postId) })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      // 실패 시 롤백
      if (newComment.postId) {
        queryClient.invalidateQueries({ queryKey: commentsKeys.list(newComment.postId) })
      }
    }
  }

  const addPostComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  return { 
    addComment, 
    addPostComment,
    isLoading: addCommentMutation.isPending
  }
}
