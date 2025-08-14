import { useCreateComment } from "@/features/comment/create-comment/model"
import { useUpdateComment } from "@/features/comment/update-comment/model"
import { useDeleteComment } from "@/features/comment/delete-comment/model"
import { useLikeComment } from "@/features/comment/like-comment/model"
import { useComments } from "@/features/comment/read-comment/model"
import { Comment, CreateComment } from "@/entities/comment/model"

export const useCommentActions = (postId: number) => {
  const { data: commentsData } = useComments(postId)
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  const handleAddComment = async (comment: CreateComment) => {
    try {
      await createCommentMutation.mutateAsync({
        body: comment.body,
        postId: postId,
        userId: comment.userId,
      })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const updateComment = async (commentId: number, body: string) => {
    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        body,
      })
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const deleteComment = async (id: number) => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId: id,
        postId: postId,
      })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const likeComment = async (id: number) => {
    try {
      const comment = commentsData?.comments?.find((c: Comment) => c.id === id)
      if (!comment) return

      await likeCommentMutation.mutateAsync({
        commentId: id,
        postId: postId,
        currentLikes: comment.likes,
      })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return {
    commentsData,
    handleAddComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}
