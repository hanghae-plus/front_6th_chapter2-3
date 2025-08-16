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
    onSuccess: (created, variables, context) => {
      // 모든 리스트 쿼리 캐시에 새 게시물 동기화
      qc.getQueriesData({ queryKey: postsKeys.lists() }).forEach(([key, old]) => {
        const params = (key as readonly unknown[])[2] as { tag?: string; search?: string } | undefined
        if (!old || typeof old !== 'object' || !('posts' in old)) return
        const list = old as PostsResponse
        // 검색 / 태그 조건 일치 여부 확인
        const tagOk = !params?.tag || params.tag === 'all' || created.tags?.includes(params.tag)
        const searchOk = !params?.search || new RegExp(params.search, 'i').test(created.title) || new RegExp(params.search, 'i').test(created.body)
        if (tagOk && searchOk) {
          qc.setQueryData(key, { ...list, posts: [created, ...list.posts], total: list.total + 1 })
        }
      })
      options?.onSuccess?.(created, variables, context)
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
