import { useCommentStore } from "./store"
import { Comment, getComments } from "../../../entities"
import { QUERY_KEYS } from "../../../shared/constants/query"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from "./mutations"

export const useComment = (postId?: number | null) => {
  const { newComment, selectedComment, setNewComment, setShowAddCommentDialog } = useCommentStore()
  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.getComments(postId!),
    queryFn: async () => {
      console.log(`Fetching comments for post ${postId}`)
      const { result, data } = await getComments(postId!)
      if (result && data) {
        return data.comments
      }
      throw new Error("댓글을 가져올 수 없습니다")
    },
    enabled: !!postId, // postId가 있을 때만 실행
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
  })
  const likeCommentMutation = useLikeCommentMutation()
  // 댓글 좋아요
  const likeComment = async (id: number, postId: number) => {
    likeCommentMutation.mutate({
      id,
      postId,
      currentLikes: comments.find((comment) => (comment as Comment).id === id)!.likes ?? 0,
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
    likeComment,
    addComment,
    updateComment,
    deleteComment,
    handleAddComment,
  }
}
