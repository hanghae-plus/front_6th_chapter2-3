import { addPost as addPostAction, deletePost as deletePostAction, updatePost as updatePostAction } from "../api"
import { postEntityQueries } from "../api"
import { optimisticAddPost, optimisticDeletePost, optimisticDislikePost, optimisticLikePost, optimisticUndoDislikePost, optimisticUndoLikePost, optimisticUpdatePost } from "../libs"
import type { getPostsBySlugRequestParamsSchema } from "../model"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type z from "zod"

type UsePostMutationsParams = {
  queryParams?: z.infer<typeof getPostsBySlugRequestParamsSchema>
}

export const usePostMutations = ({ queryParams }: UsePostMutationsParams = {}) => {
  const queryClient = useQueryClient()

  const addPost = useMutation({
    mutationFn: addPostAction,
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
    onSuccess: (addPostResponse) => {
      if (!queryParams) return

      if (queryParams.slug) {
        queryClient.setQueryData(
          postEntityQueries.getPostsBySlug({ ...queryParams, slug: queryParams.slug }).queryKey,
          (prevPostResponse) => optimisticAddPost(prevPostResponse, addPostResponse),
        )
      } else {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticAddPost(prevPostResponse, addPostResponse),
        )
      }
    },
  })

  const updatePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
    onSuccess: (updatePostResponse) => {
      if (!queryParams) return

      if (queryParams.slug) {
        queryClient.setQueryData(
          postEntityQueries.getPostsBySlug({ ...queryParams, slug: queryParams.slug }).queryKey,
          (prevPostResponse) => optimisticUpdatePost(prevPostResponse, updatePostResponse),
        )
      } else {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticUpdatePost(prevPostResponse, updatePostResponse),
        )
      }
    },
  })

  const deletePost = useMutation({
    mutationFn: deletePostAction,
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    },
    onSuccess: (deletePostResponse) => {
      if (!queryParams) return

      if (queryParams.slug) {
        queryClient.setQueryData(
          postEntityQueries.getPostsBySlug({ ...queryParams, slug: queryParams.slug }).queryKey,
          (prevPostResponse) => optimisticDeletePost(prevPostResponse, deletePostResponse),
        )
      } else {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticDeletePost(prevPostResponse, deletePostResponse),
        )
      }
    },
  })

  const likePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 좋아요 오류:", error)
    },
    onSuccess: (likePostResponse) => {
      if (!queryParams) return

      if (queryParams.slug) {
        queryClient.setQueryData(
          postEntityQueries.getPostsBySlug({ ...queryParams, slug: queryParams.slug }).queryKey,
          (prevPostResponse) => optimisticLikePost(prevPostResponse, likePostResponse),
        )
      } else {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticLikePost(prevPostResponse, likePostResponse),
        )
      }
    },
  })

  const undoLikePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 좋아요 취소 오류:", error)
    },
    onSuccess: (undoLikePostResponse) => {
      if (queryParams) {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticUndoLikePost(prevPostResponse, undoLikePostResponse),
        )
      }
    },
  })

  const dislikePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 싫어요 오류:", error)
    },
    onSuccess: (dislikePostResponse) => {
      if (queryParams) {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticDislikePost(prevPostResponse, dislikePostResponse),
        )
      }
    },
  })

  const undoDislikePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 싫어요 취소 오류:", error)
    },
    onSuccess: (undoDislikePostResponse) => {
      if (queryParams) {
        queryClient.setQueryData(
          postEntityQueries.getPosts({ ...queryParams }).queryKey,
          (prevPostResponse) => optimisticUndoDislikePost(prevPostResponse, undoDislikePostResponse),
        )
      }
    },
  })

  return {
    addPost,
    updatePost,
    deletePost,
    likePost,
    undoLikePost,
    dislikePost,
    undoDislikePost,
  }
}
