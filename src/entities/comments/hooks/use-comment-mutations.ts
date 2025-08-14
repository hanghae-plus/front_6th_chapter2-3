import { addComment as addCommentAction, deleteComment as deleteCommentAction, likeComment as likeCommentAction, updateComment as updateCommentAction } from "../api"
import { commentEntityQueries } from "../api"
import { optimisticAddComment, optimisticDeleteComment, optimisticPatchComment } from "../libs"

import { useMutation, useQueryClient } from "@tanstack/react-query"

type UseCommentMutationsParams = {
  postId: number
}

export const useCommentMutations = ({ postId }: UseCommentMutationsParams) => {
  const queryClient = useQueryClient()


  const addComment = useMutation({
    mutationFn: addCommentAction,
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
    onSuccess: (addCommentResponse) => {
      queryClient.setQueryData(
        commentEntityQueries.getCommentsByPostId(postId).queryKey,
        (prevCommentResponse) => {
          return optimisticAddComment(prevCommentResponse, addCommentResponse)
        },
      )
    },
  })

  const updateComment = useMutation({
    mutationFn: updateCommentAction,
    onError: (error) => {
      console.error("댓글 수정 오류:", error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: commentEntityQueries.getCommentsByPostId(postId).queryKey,
      })
    },
  })

  const deleteComment = useMutation({
    mutationFn: deleteCommentAction,
    onError: (error) => {
      console.error("댓글 삭제 오류:", error)
    },
    onSuccess: (deleteCommentResponse) => {
      queryClient.setQueryData(
        commentEntityQueries.getCommentsByPostId(postId).queryKey,
        (prevCommentResponse) => optimisticDeleteComment(prevCommentResponse, deleteCommentResponse),
      )
    },
  })

  const likeComment = useMutation({
    mutationFn: likeCommentAction,
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
    onSuccess: (likeCommentResponse, likeCommentRequest) => {
      queryClient.setQueryData(
        commentEntityQueries.getCommentsByPostId(postId).queryKey,
        (prevCommentResponse) => optimisticPatchComment(prevCommentResponse, { ...likeCommentResponse, likes: likeCommentRequest.likes ?? 0 }),
      )
    },
  })

  return {
    addComment,
    updateComment,
    deleteComment,
    likeComment,
  }
}
