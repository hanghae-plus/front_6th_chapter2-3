import { requestApi } from "../../../shared/lib"
import { DeleteComment, UpsertComment } from "../type"
import { useCommentStore } from "./store"
import { Comment, getComments } from "../../../entities"
import { QUERY_KEYS } from "../../../shared/constants/query"
import { useQueryClient } from "@tanstack/react-query"

export const useComment = () => {
  const queryClient = useQueryClient()
  const {
    comments,
    setComments,
    newComment,
    selectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  } = useCommentStore()

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      // 로딩 상태 표시
      setComments((prev) => ({ ...prev, [postId]: [] }))
      
      // TanStack Query로 데이터 가져오기
      const commentData = await queryClient.fetchQuery({
        queryKey: QUERY_KEYS.getComments(postId),
        queryFn: async () => {
          console.log(`Fetching comments for post ${postId}`)
          const { result, data } = await getComments(postId)
          if (result && data) {
            console.log("commentData")
            console.log(data)
            return data.comments
          }
          throw new Error("댓글을 가져올 수 없습니다")
        },
        staleTime: 2 * 60 * 1000, // 2분
        gcTime: 5 * 60 * 1000, // 5분
      })

      // Zustand store에 저장
      setComments((prev) => ({ ...prev, [postId]: commentData }))
      
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
      // 에러 시 빈 배열로 설정
      setComments((prev) => ({ ...prev, [postId]: [] }))
    }
  }

  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    const filtredComments = comments[postId]
    try {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PATCH",
        body: {
          likes: (filtredComments.find((comment) => (comment as Comment).id === id)!.likes ?? 0) + 1,
        },
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

  const addComment = async (postId: number) => {
    try {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/add`, {
        method: "POST",
        body: { ...newComment, postId: postId },
      })

      if (result && data) {
        setComments((prev) => ({
          ...prev,
          [data.postId]: [...(prev[data.postId] || []), data],
        }))
      }
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${selectedComment?.id}`, {
        method: "PUT",
        body: { body: selectedComment?.body },
      })

      if (result && data) {
        setComments({
          ...comments,
          [data.postId]: (comments[data.postId] ?? []).map((c) => (c.id === data.id ? data : c)),
        })
        setShowEditCommentDialog(false)
      }
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
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
    fetchComments,
    likeComment,
    addComment,
    updateComment,
    deleteComment,
    handleAddComment,
  }
}
