import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getPosts,
  getPostsParams,
  getPostsSearch,
  getPostsTags,
  getPostsTagTagName,
  createPosts,
  updatePosts,
  deletePosts,
  CreatePostsRequest,
} from "../../../entities/posts"
import { getUsers } from "../../../entities/users"
import { usePagination, useSearchFilter } from "../../../shared/store"
import { useEffect } from "react"
import type { Post } from "../../../entities/posts/api/types"
import type { PostsWithUsers } from "../post-list/ui/PostList"

export const postsKeys = {
  all: ["posts"] as const,
  lists: () => [...postsKeys.all, "list"] as const,
  list: (params: getPostsParams) => [...postsKeys.lists(), params] as const,
  search: (query: string) => [...postsKeys.all, "search", query] as const,
  byTag: (tag: string, params: getPostsParams) => [...postsKeys.all, "tag", tag, params] as const,
}

export const tagsKeys = {
  all: ["tags"] as const,
}

export const usePostsQuery = () => {
  const { skip, limit, setTotal } = usePagination()
  const { selectedTag, searchQuery } = useSearchFilter()

  const query = useQuery({
    queryKey: searchQuery
      ? postsKeys.search(searchQuery)
      : selectedTag
        ? postsKeys.byTag(selectedTag, { limit, skip: skip.toString() })
        : postsKeys.list({ limit, skip: skip.toString() }),
    queryFn: async () => {
      let postsRes

      if (searchQuery) {
        postsRes = await getPostsSearch(searchQuery, { limit: limit.toString(), skip: skip.toString() })
      } else if (selectedTag) {
        postsRes = await getPostsTagTagName(selectedTag, { limit, skip: skip.toString() })
      } else {
        postsRes = await getPosts({ limit, skip: skip.toString() })
      }

      const usersRes = await getUsers({ limit: 0, select: "username,image" })
      const { users: usersData } = usersRes.data

      const postsWithUsers: PostsWithUsers[] = postsRes.data.posts.map((post) => ({
        ...post,
        author: usersData.find((user) => user.id === post.userId),
      }))

      return {
        posts: postsWithUsers,
        total: postsRes.data.total,
      }
    },
    staleTime: 5 * 60 * 1000, // 5분
  })

  useEffect(() => {
    if (query.data?.total !== undefined) {
      setTotal(query.data.total)
    }
  }, [query.data?.total, setTotal])

  return query
}

export const useSearchPosts = () => {
  const { searchQuery } = useSearchFilter()

  return useQuery({
    queryKey: postsKeys.search(searchQuery),
    queryFn: async () => {
      const response = await getPostsSearch(searchQuery)
      return response.data
    },
    enabled: !!searchQuery,
    staleTime: 1 * 60 * 1000, // 1분
  })
}

// Tags Query
export const useTagsQuery = () => {
  return useQuery({
    queryKey: tagsKeys.all,
    queryFn: async () => {
      const response = await getPostsTags()
      return response.data
    },
    staleTime: 10 * 60 * 1000, // 10분
  })
}

export const useAddPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPost: CreatePostsRequest) => createPosts(newPost),
    onMutate: async (newPost) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() })

      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.lists() })

      queryClient.setQueriesData(
        { queryKey: postsKeys.lists() },
        (old: { posts: PostsWithUsers[]; total: number } | undefined) => {
          if (!old) return old

          const optimisticPost: PostsWithUsers = {
            id: Date.now(), // temporary ID
            title: newPost.title,
            body: newPost.body,
            userId: newPost.userId,
            tags: [],
            reactions: { likes: 0, dislikes: 0 },
            views: 0,
            author: undefined, // Will be filled by server response
          }

          return {
            ...old,
            posts: [optimisticPost, ...old.posts],
            total: old.total + 1,
          }
        },
      )

      return { previousPosts }
    },
  })
}

export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Post }) => updatePosts(id, post),
    onMutate: async ({ id, post }) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() })
      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.lists() })

      queryClient.setQueriesData(
        { queryKey: postsKeys.lists() },
        (old: { posts: PostsWithUsers[]; total: number } | undefined) => {
          if (!old) return old

          return {
            ...old,
            posts: old.posts.map((p: PostsWithUsers) => (p.id === id ? { ...p, ...post } : p)),
          }
        },
      )

      return { previousPosts }
    },
  })
}

export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deletePosts(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: postsKeys.lists() })
      const previousPosts = queryClient.getQueriesData({ queryKey: postsKeys.lists() })

      // Optimistic update
      queryClient.setQueriesData(
        { queryKey: postsKeys.lists() },
        (old: { posts: PostsWithUsers[]; total: number } | undefined) => {
          if (!old) return old

          return {
            ...old,
            posts: old.posts.filter((p: PostsWithUsers) => p.id !== postId),
            total: old.total - 1,
          }
        },
      )

      return { previousPosts }
    },
  })
}
