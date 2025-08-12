import { apiClient } from "../../../shared/api/base"
import { useCommentStore } from "../model/store"
import { Comment, CreateCommentRequest } from "../model/types"

export const useCommentApi = () => {
  const { comments, setComments, addComment, likeComment, removeComment, updateComment } = useCommentStore()

  /** 댓글 목록 가져오기 */
  const getComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const data = await apiClient.get<{ comments: Comment[] }>(`/comments/post/${postId}`)
      setComments(postId, data.comments)
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 추가
  const addCommentApi = async (newComment: CreateCommentRequest) => {
    try {
      const data = await apiClient.post<Comment>("/comments/add", newComment)
      addComment(data)
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateCommentApi = async (commentId: number, body: string) => {
    try {
      const data = await apiClient.put<Comment>(`/comments/${commentId}`, { body })
      updateComment(data)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const removeCommentApi = async (postId: number, commentId: number) => {
    try {
      await apiClient.delete(`/comments/${commentId}`)
      removeComment(commentId, postId) // (id, postId) 순서!
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const likeCommentApi = async (postId: number, commentId: number) => {
    try {
      const target = comments[postId]?.find((c) => c.id === commentId)
      if (!target) return
      await apiClient.patch<Comment>(`/comments/${commentId}`, { likes: target.likes + 1 })
      likeComment(commentId, postId)
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  return { getComments, addCommentApi, updateCommentApi, removeCommentApi, likeCommentApi }
}
