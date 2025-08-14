import {
  getPosts,
  getPostsByTag,
  searchPosts,
  getTags,
  addPost as addPostApi,
  updatePost as updatePostApi,
  deletePost as deletePostApi,
  Post,
  PostsResponse,
} from '../../shared/api/posts'
import { postsKeys } from '../../shared/queryKeys'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query'

/* ------------------------------ Queries ------------------------------ */
interface ListParams {
  skip?: number
  limit?: number
  tag?: string
  search?: string
}

export const usePostsQuery = (params: ListParams = {}) => {
  const { skip = 0, limit = 10, tag = '', search = '' } = params
  return useQuery<PostsResponse, Error, PostsResponse>({
    queryKey: postsKeys.list({ skip, limit, tag, search }),
    queryFn: () => {
      if (search) return searchPosts(search)
      if (tag && tag !== 'all') return getPostsByTag(tag)
      return getPosts(skip, limit)
    },
  })
}

export const useTagsQuery = () =>
  useQuery<Array<{ slug: string; url: string }>, Error>({
    queryKey: postsKeys.tags,
    queryFn: getTags,
    staleTime: 1000 * 60 * 5,
  })

/* ---------------------------- Mutations ----------------------------- */

export const useAddPostMutation = (
  options?: UseMutationOptions<Post, Error, Omit<Post, 'id'>>,
): UseMutationResult<Post, Error, Omit<Post, 'id'>> => {
  const qc = useQueryClient()
  return useMutation<Post, Error, Omit<Post, 'id'>>({
    mutationFn: addPostApi,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: postsKeys.lists() })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useUpdatePostMutation = (
  options?: UseMutationOptions<Post, Error, Post>,
): UseMutationResult<Post, Error, Post> => {
  const qc = useQueryClient()
  return useMutation<Post, Error, Post>({
    mutationFn: updatePostApi,
    onSuccess: (...args) => {
      const updated = args[0]
      qc.invalidateQueries({ queryKey: postsKeys.detail(updated.id) })
      qc.invalidateQueries({ queryKey: postsKeys.lists() })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export const useDeletePostMutation = (
  options?: UseMutationOptions<void, Error, number>,
): UseMutationResult<void, Error, number> => {
  const qc = useQueryClient()
  return useMutation<void, Error, number>({
    mutationFn: deletePostApi,
    onSuccess: (...args) => {
      qc.invalidateQueries({ queryKey: postsKeys.lists() })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}
