import {
  addPost as addPostAction,
  deletePost as deletePostAction,
  PostSchema,
  updatePost as updatePostAction,
} from "@/entities/posts"

import {
  addComment as addCommentAction,
  commentEntityQueries,
  CommentSchema,
  deleteComment as deleteCommentAction,
  likeComment as likeCommentAction,
  updateComment as updateCommentAction,
} from "@/entities/comments"
import { postEntityQueries, postSchema } from "@/entities/posts"
import { userEntityQueries, userSchema } from "@/entities/users"
import { useQueryParamsPagination } from "@/shared/hooks"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { parseAsString, useQueryState } from "nuqs"
import { useState } from "react"

export const postWithUserSchema = postSchema.extend({
  author: userSchema.optional(),
})

export const usePostManagementViewPresenter = () => {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useQueryParamsPagination()
  const [selectedTag, setSelectedTag] = useQueryState("tag", parseAsString.withDefault(""))

  const [selectedPost, setSelectedPost] = useState<PostSchema | null>(null)
  const [selectedComment, setSelectedComment] = useState<CommentSchema | null>(null)

  const handleLimitChange = (limit: number) => {
    setPagination((prevPagination) => ({ ...prevPagination, limit }))
  }

  const handleNextPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      skip: prevPagination.skip + prevPagination.limit,
    }))
  }
  const handlePreviousPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      skip: Math.max(0, prevPagination.skip - prevPagination.limit),
    }))
  }

  const postsQuery = useQuery({
    ...postEntityQueries.getPosts({ limit: pagination.limit, skip: pagination.skip }),
  })

  const postPagination = {
    limit: postsQuery.data?.limit ?? 0,
    skip: postsQuery.data?.skip ?? 0,
    total: postsQuery.data?.total ?? 0,
  }

  const usersQuery = useQuery({
    ...userEntityQueries.getUsers({ limit: 0, select: "username,image" }),
    enabled: postsQuery.isFetched,
    select: (response) => ({
      data: response.users,
      pagination: { limit: response?.limit ?? 0, skip: response?.skip ?? 0, total: response?.total ?? 0 },
    }),
  })

  const { data: tags } = useQuery({
    ...postEntityQueries.getPostTags(),
  })

  const { data: getCommentsByPostIdResponse } = useQuery({
    ...commentEntityQueries.getCommentsByPostId(selectedPost?.id as number),
    enabled: !!selectedPost?.id,
    select: (response) => ({
      data: response.comments,
      pagination: { limit: response?.limit ?? 0, skip: response?.skip ?? 0, total: response?.total ?? 0 },
    }),
  })

  const postWithAuthors = postsQuery.data?.posts.map((post) => ({
    ...post,
    author: usersQuery.data?.data.find((user) => user.id === post.userId),
  }))

  // mutation
  const addPost = useMutation({
    mutationFn: addPostAction,
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })

  const updatePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const deletePost = useMutation({
    mutationFn: deletePostAction,
    onError: (error) => console.error("게시물 삭제 오류:", error),
  })

  const addComment = useMutation({
    mutationFn: addCommentAction,
    onError: (error) => {
      console.error("댓글 추가 오류:", error)
    },
  })

  const updateComment = useMutation({
    mutationFn: updateCommentAction,
    onError: (error) => console.error("댓글 수정 오류:", error),
  })

  const deleteComment = useMutation({
    mutationFn: deleteCommentAction,
    onError: (error) => console.error("댓글 삭제 오류:", error),
  })

  const likeComment = useMutation({
    mutationFn: likeCommentAction,
    onError: (error) => console.error("댓글 좋아요 오류:", error),
  })

  const refetchUsers = () => {
    queryClient.invalidateQueries({
      queryKey: userEntityQueries.getUsers({ limit: 0, select: "username,image" }).queryKey,
    })
  }

  const postsBySlugQuery = useQuery({
    ...postEntityQueries.getPostsBySlug(selectedTag),
    enabled: !!selectedTag,
  })

  return {
    pagination,
    setPagination,

    selectedTag,
    setSelectedTag,
    selectedComment,

    postPagination,

    setSelectedPost,
    setSelectedComment,

    // actions
    handleLimitChange,
    handleNextPage,
    handlePreviousPage,

    // queries
    postsQuery,
    postsBySlugQuery,
    getCommentsByPostIdResponse,
    usersQuery,
    tags,
    postWithAuthors,

    // mutations
    addPost,
    updatePost,
    deletePost,
    addComment,
    updateComment,
    deleteComment,
    likeComment,

    // refetch
    refetchUsers,
  }
}

export const getPosts = () => {}
