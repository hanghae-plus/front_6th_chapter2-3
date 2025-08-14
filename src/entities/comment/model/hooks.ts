import { useMutation, useQuery } from "@tanstack/react-query"
import CommentAPI from "../api/CommentAPI"
import { CreateComment } from "./types"

export const useGetComments = (postId: number) => {
  return useQuery({
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
