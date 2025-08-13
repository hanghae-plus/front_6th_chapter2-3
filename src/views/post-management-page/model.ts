import { useQueryParamsPagination } from "@/shared/hooks"
import { deleteComment as deleteCommentAction, likeComment as likeCommentAction } from "@/entities/comments"
import { addPost as addPostAction, getPostsRequestParamsSchema, optimisticAddPost, postEntityQueries, updatePost as updatePostAction } from "@/entities/posts"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export const usePostManagement = () => {
  const queryClient = useQueryClient()
  const [queryParamsPagination] = useQueryParamsPagination()

  const addPost = useMutation({
    mutationFn: addPostAction,
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
    onSuccess: (addPostResponse) => {
      queryClient.setQueryData(
        postEntityQueries.getPosts({
          limit: queryParamsPagination.limit,
          skip: queryParamsPagination.skip,
          sortBy: getPostsRequestParamsSchema.shape.sortBy.safeParse(queryParamsPagination.sortBy)?.data,
          order: queryParamsPagination.order,
        }).queryKey,
        (prevPostResponse) => optimisticAddPost(prevPostResponse, addPostResponse),
      )
    },
  })

  const updatePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const deleteComment = useMutation({
    mutationFn: deleteCommentAction,
    onError: (error) => console.error("댓글 삭제 오류:", error),
  })

  const likeComment = useMutation({
    mutationFn: likeCommentAction,
    onError: (error) => console.error("댓글 좋아요 오류:", error),
  })

  return { queryParamsPagination, addPost, updatePost, deleteComment, likeComment }
}


