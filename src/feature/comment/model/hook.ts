import { requestApi } from "../../../shared/lib"
import { DeleteComment, UpsertComment } from "../type"
import { useCommentStore } from "./store"
import { Comment } from "../../../entities"

export const useCommnet = () => {
  const { comments, setComments, setNewComment, setShowAddCommentDialog } = useCommentStore()

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    const filtredComments = comments[postId]
    try {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: (filtredComments.find((comment) => (comment as Comment).id === id)!.likes ?? 0) + 1,
        }),
      })

      if (result && data) {
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].map((comment) =>
            comment.id === data.id ? { ...data, likes: (comment.likes ?? 0) + 1 } : comment,
          ),
        }))
      }
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // 댓글 삭제
  const deleteComment = async (id: number, postId: number) => {
    try {
      const { result, data } = await requestApi<DeleteComment>(`/api/comments/${id}`, {
        method: "DELETE",
      })

      if (result && data) {
        setComments((prev) => ({
          ...prev,
          [postId]: prev[postId].filter((comment) => comment.id !== id),
        }))
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const handleAddComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  return {
    comments,
    likeComment,
    deleteComment,
    handleAddComment,
  }
}
