import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Comments, CommentsResponse, CreateCommentRequest, LikeCommentRequest, UpdateCommentRequest } from "./types"
import { commentQueryKeys } from "./queryKeys.ts"
import { createComment, deleteComment, getComments, likeComment, updateComment } from "../api"

// query
export const useGetCommentsQuery = (postId: number) =>{

  return useQuery<CommentsResponse>({
    queryKey: commentQueryKeys.list(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId
  })
}