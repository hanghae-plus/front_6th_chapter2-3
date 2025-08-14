import { useState } from "react"
import {
  addCommentApi,
  deleteCommentApi,
  getCommentsByPostIdApi,
  likeCommentApi,
  updateCommentApi,
} from "../api/comment-api"
import { loadingAtom } from "../../../shared/model/store"
import { useAtom } from "jotai"

export const useComment = () => {
  const [loading, setLoading] = useAtom(loadingAtom)
  const [comments, setComments] = useState({})
  const [selectedComment, setSelectedComment] = useState(null)
  const [newComment, setNewComment] = useState({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  // 댓글 가져오기
  const fetchComments = async (postId) => {
    if (comments[postId]) return
    setLoading(true)
    try {
      const response = await getCommentsByPostIdApi(postId)
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 댓글 추가
  const addComment = async () => {
    setLoading(true)
    try {
      const response = await addCommentApi(newComment)
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
    setLoading(false)
  }

  // 댓글 수정
  const updateComment = async () => {
    setLoading(true)
    try {
      const response = await updateCommentApi(selectedComment)
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 수정 오류:", error)
    }
    setLoading(false)
  }

  // 댓글 삭제
  const deleteComment = async (id, postId) => {
    setLoading(true)
    try {
      await deleteCommentApi(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
    setLoading(false)
  }

  // 댓글 좋아요
  const likeComment = async (id, postId) => {
    setLoading(true)
    try {
      const currentLikes = Array.isArray(comments[postId]) ? (comments[postId].find((c) => c.id === id)?.likes ?? 0) : 0
      const response = await likeCommentApi(id, currentLikes + 1)
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
    setLoading(false)
  }

  return {
    comments,
    selectedComment,
    setSelectedComment,
    newComment,
    setNewComment,
    showAddCommentDialog,
    setShowAddCommentDialog,
    showEditCommentDialog,
    setShowEditCommentDialog,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}
