import { useCommentStore } from "./store"
import { Comment, getComments } from "../../../entities"
import { QUERY_KEYS } from "../../../shared/constants/query"
import { useQueryClient } from "@tanstack/react-query"
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from "./mutations"

export const useComment = () => {
  const queryClient = useQueryClient()
  const { comments, setComments, newComment, selectedComment, setNewComment, setShowAddCommentDialog } =
    useCommentStore()

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
            return data.comments
          }
          throw new Error("댓글을 가져올 수 없습니다")
        },
      })

      // Zustand store에 저장
      setComments((prev) => ({ ...prev, [postId]: commentData }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
      // 에러 시 빈 배열로 설정
      setComments((prev) => ({ ...prev, [postId]: [] }))
    }
  }

  const likeCommentMutation = useLikeCommentMutation()
  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    const filtredComments = comments[postId]
    likeCommentMutation.mutate({
      id,
      postId,
      currentLikes: filtredComments.find((comment) => (comment as Comment).id === id)!.likes ?? 0,
    })
  }

  const addCommentMutation = useAddCommentMutation()
  const addComment = async (postId: number) => {
    addCommentMutation.mutate({
      newComment,
      postId,
    })
  }

  // 댓글 업데이트
  const updateCommentMutation = useUpdateCommentMutation()
  const updateComment = async () => {
    if (!selectedComment) {
      console.error("수정할 댓글이 선택되지 않았습니다")
      return
    }

    updateCommentMutation.mutate({
      id: selectedComment.id,
      body: selectedComment.body,
      postId: selectedComment.postId,
    })
  }

  // 댓글 삭제
  const deleteCommentMutation = useDeleteCommentMutation()
  const deleteComment = async (id: number, postId: number) => {
    deleteCommentMutation.mutate({ id, postId })
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
