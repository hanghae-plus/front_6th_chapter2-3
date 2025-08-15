import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"

import { postsApi } from "@/entities/post/api/postApi"
import { userApi } from "@/entities/post/api/userApi"
import { queryKeys } from "@/entities/post/lib/queryKeys"
import { AddPost, PostSearchParams, PostsResponse, UpdatePost } from "@/entities/post/model"

/** 게시물 목록 조회 */
export const useGetPosts = (params: PostSearchParams) => {
  const queryKey = queryKeys.posts.list(params)

  const queryFn = () => {
    // 검색어가 있으면 검색 API 사용 (태그 무시)
    if (params.search && params.search.trim()) {
      return postsApi.searchPosts(params.search, {
        limit: params.limit,
        skip: params.skip,
        sortBy: params.sortBy !== "none" ? params.sortBy : undefined,
        order: params.order,
      })
    }

    // 태그가 있고 "all"이 아니면 태그 API 사용
    if (params.tag && params.tag !== "all") {
      return postsApi.getPostsByTag(params.tag, {
        limit: params.limit,
        skip: params.skip,
        sortBy: params.sortBy !== "none" ? params.sortBy : undefined,
        order: params.order,
      })
    }

    // 기본 posts API 사용 (정렬 포함)
    return postsApi.getPosts({
      limit: params.limit,
      skip: params.skip,
      sortBy: params.sortBy !== "none" ? params.sortBy : undefined,
      order: params.order,
    })
  }

  const postsQuery = useQuery({
    queryKey,
    queryFn,
  })

  const usersQuery = useQuery({
    queryKey: queryKeys.users.basic(),
    queryFn: () => userApi.getAllUsers(),
    enabled: postsQuery.isSuccess,
  })

  const postsWithUsers = useMemo(() => {
    if (!postsQuery.isSuccess || !usersQuery.isSuccess) return []
    if (!postsQuery.data?.posts || !usersQuery.data?.users) return []

    return postsQuery.data.posts.map((post) => ({
      ...post,
      author: usersQuery.data.users.find((user) => user.id === post.userId),
    }))
  }, [postsQuery.isSuccess, postsQuery.data, usersQuery.isSuccess, usersQuery.data])

  return {
    posts: postsWithUsers,
    total: postsQuery.data?.total || 0,
    isLoading: postsQuery.isLoading || usersQuery.isLoading,
    error: postsQuery.error || usersQuery.error,
  }
}

/** 게시물 추가 */
export const useAddPost = (params: PostSearchParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postData: AddPost) => postsApi.addPost(postData),
    onSuccess: (postData) => {
      queryClient.setQueryData(queryKeys.posts.list(params), (oldData: PostsResponse) => {
        return {
          ...oldData,
          posts: [{ ...postData, id: oldData.posts.length + 1 }, ...oldData.posts],
          total: oldData.total + 1,
        }
      })
    },
    onError: (error) => {
      console.error("게시물 추가 실패:", error)
    },
  })
}

/** 게시물 수정 */
export const useUpdatePost = (params: PostSearchParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postData: UpdatePost) => postsApi.updatePost(postData),
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(queryKeys.posts.list(params), (oldData: PostsResponse) => {
        return {
          ...oldData,
          posts: oldData.posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)),
        }
      })
    },
    onError: (error) => {
      console.error("게시물 수정 실패:", error)
    },
  })
}

/** 게시물 삭제 */
export const useDeletePost = (params: PostSearchParams) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: (_, deletedPostId) => {
      queryClient.setQueryData(queryKeys.posts.list(params), (oldData: PostsResponse) => {
        return {
          ...oldData,
          posts: oldData.posts.filter((post) => post.id !== deletedPostId),
          total: oldData.total - 1,
        }
      })
    },
    onError: (error) => {
      console.error("게시물 삭제 실패:", error)
    },
  })
}
