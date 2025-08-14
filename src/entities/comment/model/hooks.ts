import { useMutation, useQuery } from "@tanstack/react-query"
import CommentAPI from "../api/CommentAPI"
import { CreateComment, UpdateComment } from "./types"

export const useComments = (postId: number) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => CommentAPI.getComments(postId),
  })
}

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (comment: CreateComment) => CommentAPI.createComment(comment),
    // invalidateQueries 제거 - setQueryData로 직접 처리
  })
}

export const useUpdateComment = () => {
  return useMutation({
    mutationFn: ({ id, comment }: { id: number; comment: UpdateComment }) => CommentAPI.updateComment(id, comment),
    // invalidateQueries 제거 - setQueryData로 직접 처리
  })
}

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (id: number) => CommentAPI.deleteComment(id),
    // invalidateQueries 제거 - setQueryData로 직접 처리
  })
}

export const useLikeComment = () => {
  return useMutation({
    mutationFn: (id: number) => CommentAPI.likeComment(id),
    // invalidateQueries 제거 - setQueryData로 직접 처리
  })
}
