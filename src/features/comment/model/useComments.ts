import { useAtom } from "jotai"
import { selectedCommentAtom } from "../../../store/postsAtoms"
import { useCommentsByPost, useAddComment, useUpdateComment, useDeleteComment, useLikeComment } from "../api"
import { NewComment } from "../../../types"

export const useComments = (postId?: number) => {
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)

  // TanStack Query 훅들 사용
  const commentsQuery = useCommentsByPost(postId!, { enabled: !!postId })
  const addCommentMutation = useAddComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

  const comments = commentsQuery.data?.comments || []
  const isLoading = commentsQuery.isLoading
  const error = commentsQuery.error

  const addComment = async (newComment: NewComment) => {
    try {
      const result = await addCommentMutation.mutateAsync(newComment)
      return result
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    }
  }

  const updateComment = async (commentId: number, body: string) => {
    try {
      const result = await updateCommentMutation.mutateAsync({ id: commentId, body })
      return result
    } catch (error) {
      console.error("댓글 수정 오류:", error)
      throw error
    }
  }

  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ id, postId })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
      throw error
    }
  }

  const likeComment = async (id: number) => {
    try {
      const currentComment = comments.find((c) => c.id === id)
      if (!currentComment) return

      await likeCommentMutation.mutateAsync({ id, likes: currentComment.likes + 1 })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return {
    comments,
    selectedComment,
    setSelectedComment,
    isLoading,
    error,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    // Mutation 상태들
    isAddingComment: addCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending,
  }
}
