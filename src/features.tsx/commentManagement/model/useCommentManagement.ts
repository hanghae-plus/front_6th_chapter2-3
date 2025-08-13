import { useState } from "react"
import { useCommentStore } from "../../../entities/comment/model/store"
import { CreateCommentRequest, Comment } from "../../../entities/comment/model/types"

// (비즈니스 로직만)
export const useCommentManagement = () => {
  const {
    selectedComment,
    setSelectedComment,
    createComment,
    editComment,
    deleteComment,
    toggleLikeComment,
    fetchComments,
    error: commentError,
  } = useCommentStore()

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [newComment, setNewComment] = useState<CreateCommentRequest>({
    body: "",
    postId: 0,
    userId: 1,
  })

  const handleAddComment = async () => {
    try {
      await createComment(newComment)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("댓글 추가 처리 중 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!selectedComment) return

    try {
      await editComment(selectedComment.id, selectedComment.body)
      setShowEditCommentDialog(false)
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("댓글 업데이트 처리 중 오류:", error)
    }
  }

  const handleDeleteComment = async (commentId: number, postId: number) => {
    try {
      await deleteComment(commentId, postId)
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("댓글 삭제 처리 중 오류:", error)
    }
  }

  const handleLikeComment = async (commentId: number, postId: number) => {
    try {
      await toggleLikeComment(commentId, postId)
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("댓글 좋아요 처리 중 오류:", error)
    }
  }

  const openAddCommentDialog = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  // 댓글 가져오기 (PostDetailDialog에서 사용)
  const getComments = async (postId: number) => {
    try {
      await fetchComments(postId)
    } catch (error) {
      console.error("댓글 가져오기 처리 중 오류:", error)
    }
  }

  return {
    showAddCommentDialog,
    showEditCommentDialog,
    newComment,
    selectedComment,
    commentError,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
    setNewComment,
    setSelectedComment,
    getComments,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    openAddCommentDialog,
    openEditCommentDialog,
  }
}
