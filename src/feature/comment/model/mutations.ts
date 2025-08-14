import { useMutation } from "@tanstack/react-query"
import { requestApi } from "../../../shared/lib"
import { DeleteComment, NewComment, UpsertComment } from "../type"
import { useCommentStore } from "./store"

export const useLikeCommentMutation = () => {
  const { comments, setComments } = useCommentStore()

  return useMutation({
    mutationFn: async ({ id, postId, currentLikes }: { id: number; postId: number; currentLikes: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PATCH",
        body: {
          likes: currentLikes + 1,
        },
      })

      if (!result || !data) {
        throw new Error("댓글 좋아요에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ id, postId }) => {
      // 낙관적 업데이트: 즉시 UI에 반영
      const previousComments = comments[postId]

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === id ? { ...comment, likes: (comment.likes ?? 0) + 1 } : comment,
        ),
      }))

      // 롤백용 데이터 반환
      return { previousComments, id, postId }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context) {
        setComments((prev) => ({
          ...prev,
          [context.postId]: context.previousComments,
        }))
      }
      console.error("댓글 좋아요 오류:", error)
    },
    onSuccess: (result) => {
      // 서버 응답으로 최종 업데이트 (정확한 데이터로 보정)
      const { data, postId } = result
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? { ...comment, ...data } : comment)),
      }))
    },
  })
}

export const useAddCommentMutation = () => {
  const { comments, setComments, setNewComment, setShowAddCommentDialog } = useCommentStore()

  return useMutation({
    mutationFn: async ({ newComment, postId }: { newComment: NewComment; postId: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/add`, {
        method: "POST",
        body: { ...newComment, postId },
      })

      if (!result || !data) {
        throw new Error("댓글 추가에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ newComment, postId }) => {
      // 낙관적 업데이트: 즉시 UI에 반영
      const optimisticComment = {
        id: Date.now(), // 임시 ID (서버에서 실제 ID로 교체됨)
        body: newComment.body,
        postId: postId,
        likes: 0,
        user: {
          id: newComment.userId,
          username: "You", // 현재 사용자 표시
          fullName: "Current User",
        },
      }

      const previousComments = comments[postId] || []

      // 즉시 UI에 새 댓글 추가
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), optimisticComment],
      }))

      // 롤백용 데이터 반환
      return { previousComments, optimisticComment, postId }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context) {
        setComments((prev) => ({
          ...prev,
          [context.postId]: context.previousComments,
        }))
      }
      console.error("댓글 추가 오류:", error)
    },
    onSuccess: (result, variables) => {
      const { data, postId } = result

      // 서버 응답으로 최종 업데이트 (임시 ID를 실제 ID로 교체)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === Date.now() // 임시 ID 찾아서
            ? data // 실제 서버 데이터로 교체
            : comment,
        ),
      }))

      // 성공 시 다이얼로그 닫기 및 폼 초기화
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const { comments, setComments, setShowEditCommentDialog, setSelectedComment } = useCommentStore()

  return useMutation({
    mutationFn: async ({ id, body, postId }: { id: number; body: string; postId: number }) => {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${id}`, {
        method: "PUT",
        body: { body },
      })

      if (!result || !data) {
        throw new Error("댓글 수정에 실패했습니다")
      }

      return { data, postId }
    },
    onMutate: async ({ id, body, postId }) => {
      // 이전 상태 저장 (롤백용)
      const previousComments = comments[postId]
      const previousComment = previousComments?.find((comment) => comment.id === id)

      // 낙관적 업데이트: 즉시 UI에 수정된 댓글 반영
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === id
            ? { ...comment, body } // body만 즉시 업데이트
            : comment,
        ),
      }))

      // 롤백용 데이터 반환
      return { previousComments, previousComment, id, postId }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백
      if (context && context.previousComments) {
        setComments((prev) => ({
          ...prev,
          [context.postId]: context.previousComments,
        }))

        // 선택된 댓글도 이전 상태로 복원
        if (context.previousComment) {
          setSelectedComment(context.previousComment)
        }
      }
      console.error("댓글 수정 오류:", error)
    },
    onSuccess: (result) => {
      const { data, postId } = result

      // 서버 응답으로 최종 업데이트 (전체 댓글 데이터로 교체)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) => (comment.id === data.id ? { ...comment, ...data } : comment)),
      }))

      // 성공 시 다이얼로그 닫기
      setShowEditCommentDialog(false)
      setSelectedComment(null)
    },
  })
}

export const useDeleteCommentMutation = () => {
  const { comments, setComments } = useCommentStore()

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      const { result, data } = await requestApi<DeleteComment>(`/api/comments/${id}`, {
        method: "DELETE",
      })

      if (!result || !data) {
        throw new Error("댓글 삭제에 실패했습니다")
      }

      return { data, postId, deletedId: id }
    },
    onMutate: async ({ id, postId }) => {
      // 삭제될 댓글과 이전 상태 저장 (롤백용)
      const previousComments = comments[postId]
      const deletedComment = previousComments?.find((comment) => comment.id === id)

      // 낙관적 업데이트: 즉시 UI에서 댓글 제거
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))

      // 롤백용 데이터 반환
      return { previousComments, deletedComment, id, postId }
    },
    onError: (error, variables, context) => {
      // 에러 시 이전 상태로 롤백 (삭제된 댓글 복원)
      if (context && context.previousComments) {
        setComments((prev) => ({
          ...prev,
          [context.postId]: context.previousComments,
        }))
      }
      console.error("댓글 삭제 오류:", error)
    },
    onSuccess: (result) => {
      // 삭제 성공 시 추가 처리가 필요하면 여기서
      // 이미 onMutate에서 UI 업데이트했으므로 별도 처리 불필요
      console.log(`댓글 ${result.deletedId} 삭제 완료`)
    },
  })
}
