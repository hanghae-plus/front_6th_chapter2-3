import { useState } from "react"
import { Comment, NewCommentDraft } from "../../../entities/comment/model"
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from "../../../entities/comment/model"

export const useComment = (postId?: number) => {

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewCommentDraft>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  const { data: commentsData } = useGetCommentsQuery(postId)

  const createCommentMutation = useCreateCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()


  // 댓글 추가
  const createComment = async () => {
    if (!postId) return
    createCommentMutation.mutate(
      { body: newComment.body, postId, userId: newComment.userId },
      {
        onSuccess: () => {
          setShowAddCommentDialog(false)
          setNewComment({ body: "", postId: null, userId: 1 })
        },
        onError: (e) => console.error("댓글 추가 오류:", e),
      }
    )
  }

  // 댓글 업데이트
  const updateComment = async () => {
    if (!selectedComment || !postId) return
    updateCommentMutation.mutate(
      { id: selectedComment.id, body: selectedComment.body },
      {
        onSuccess: () => setShowEditCommentDialog(false),
        onError: (e) => console.error("댓글 업데이트 오류:", e),
      }
    )
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ id, postId })
      if (showEditCommentDialog) setShowEditCommentDialog(false)
    } catch (e) {
      console.error("댓글 삭제 오류:", e)
    }
  }

  // 댓글 좋아요
  const likeComment = (id: number, postId: number) => {
    likeCommentMutation.mutate({ id, postId })
  }

  return {
    comments: commentsData?.comments ?? [],
    newComment, setNewComment,
    selectedComment, setSelectedComment,
    showAddCommentDialog, setShowAddCommentDialog,
    showEditCommentDialog, setShowEditCommentDialog,
    createComment,
    updateComment,
    deleteComment,
    likeComment
  }
}