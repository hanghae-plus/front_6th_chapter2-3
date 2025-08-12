import { useState, useCallback } from "react"
import { useCommentStore } from "../../../entities/comment/model/store"
import { CreateCommentRequest, Comment } from "../../../entities/comment/model/types"
import { useCommentApi } from "../../../entities/comment/api"

// (비즈니스 로직만)
export const useCommentManagement = () => {
  const { comments, updateComment, removeComment, likeComment, selectedComment, setSelectedComment } = useCommentStore()

  const { getComments, addCommentApi, likeCommentApi, removeCommentApi, updateCommentApi } = useCommentApi()

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [newComment, setNewComment] = useState<CreateCommentRequest>({
    body: "",
    postId: 0,
    userId: 1,
  })
  const handleAddComment = async () => {
    try {
      await addCommentApi(newComment)
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const handleUpdateComment = async () => {
    if (!selectedComment) return

    try {
      const updatedComment = await updateCommentApi(selectedComment.id, { body: selectedComment.body })
      updateComment(updatedComment)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await removeCommentApi(id)
      removeComment(id, postId)
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleLikeComment = async (id: number, postId: number) => {
    try {
      const currentComment = comments[postId]?.find((c) => c.id === id)
      if (currentComment) {
        await commentApi.likeComment(id, currentComment.likes + 1)
        likeComment(id, postId)
      }
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
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

  return {
    showAddCommentDialog,
    showEditCommentDialog,
    newComment,
    selectedComment,
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
