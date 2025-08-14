import { useMutation, useQuery } from "@tanstack/react-query"
import CommentAPI from "../api/CommentAPI"
import { CreateComment, CommentList } from "./types"

export const useComments = (postId: number) => {
  return useQuery<CommentList>({
    queryKey: ["comments", postId],
    queryFn: () => CommentAPI.getComments(postId),
  })
}

export const useCreateComment = () => {
  return useMutation({
    mutationFn: (comment: CreateComment) => CommentAPI.createComment(comment),
  })
}

export const useUpdateComment = (id: number) => {
  return useMutation({
    mutationFn: (comment: CreateComment) => CommentAPI.updateComment(id, comment),
  })
}

export const useDeleteComment = () => {
  return useMutation({
    mutationFn: (id: number) => CommentAPI.deleteComment(id),
  })
}

export const useLikeComment = () => {
  return useMutation({
    mutationFn: (id: number) => CommentAPI.likeComment(id),
  })
}
