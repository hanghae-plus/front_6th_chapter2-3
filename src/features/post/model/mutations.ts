import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { createPost, updatePost, deletePost } from "@/features/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { PostPaginatedResponse, Post, PostWithAuthor, UpdatePost } from "@/shared/types"

export const postMutations = {
  keys: {
    base: () => ["posts"] as const,
    create: () => ["posts", "create"] as const,
    update: (id: number) => ["posts", "update", id] as const,
    remove: (id: number) => ["posts", "remove", id] as const,
  },

  create: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: postMutations.keys.create(),
      mutationFn: createPost,
      onSuccess: (newPost: Post) => {
        qc.setQueriesData({ queryKey: POST_QK.list({}) }, (old: PostPaginatedResponse) => {
          return {
            ...old,
            posts: [newPost, ...old.posts],
            total: old.total + 1,
          }
        })
      },
    }),

  update: (qc: QueryClient, id: number) =>
    mutationOptions({
      mutationKey: postMutations.keys.update(id),
      mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePost(id, data),
      onMutate: async ({ id, data }) => {
        // 낙관적 업데이트를 위한 이전 데이터 백업
        const previousPost = qc.getQueryData(POST_QK.detail(id))

        // 낙관적으로 상세 데이터 업데이트
        qc.setQueryData(POST_QK.detail(id), (old: PostWithAuthor | undefined) => {
          if (!old) return old
          return { ...old, ...data }
        })

        // 모든 관련 쿼리에서 해당 포스트 낙관적 업데이트
        qc.setQueriesData({ queryKey: POST_QK.base() }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? { ...p, ...data } : p)),
          }
        })

        // 태그별 쿼리들도 낙관적 업데이트
        qc.setQueriesData({ queryKey: [...POST_QK.base(), "byTag"] }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? { ...p, ...data } : p)),
          }
        })

        // 검색 쿼리들도 낙관적 업데이트
        qc.setQueriesData({ queryKey: [...POST_QK.base(), "search"] }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? { ...p, ...data } : p)),
          }
        })

        return { previousPost }
      },
      onSuccess: (updatedPost) => {
        // 성공 시에는 낙관적 업데이트를 유지하고 추가 업데이트만 수행
        // 깜빡거림을 방지하기 위해 기존 데이터를 교체하지 않음

        // 필요한 경우에만 추가 데이터 업데이트 (예: updatedAt, version 등)
        // 현재는 title과 body만 수정하므로 낙관적 업데이트로 충분

        console.log("게시물 업데이트 성공:", updatedPost)
      },
      onError: (err, { id }, context) => {
        // 에러 발생 시 이전 데이터로 롤백
        if (context?.previousPost) {
          qc.setQueryData(POST_QK.detail(id), context.previousPost)
        }

        // 모든 관련 쿼리에서도 롤백
        qc.setQueriesData({ queryKey: POST_QK.base() }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? context?.previousPost : p)),
          }
        })

        // 태그별 쿼리들도 롤백
        qc.setQueriesData({ queryKey: [...POST_QK.base(), "byTag"] }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? context?.previousPost : p)),
          }
        })

        // 검색 쿼리들도 롤백
        qc.setQueriesData({ queryKey: [...POST_QK.base(), "search"] }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === id ? context?.previousPost : p)),
          }
        })
      },
    }),

  remove: (qc: QueryClient, id: number) =>
    mutationOptions({
      mutationKey: postMutations.keys.remove(id),
      mutationFn: (id: number) => deletePost(id),
      onSuccess: (_void, id) => {
        // 상세 캐시 제거
        qc.removeQueries({ queryKey: POST_QK.detail(id) })

        // 모든 관련 쿼리에서 해당 포스트 제거
        qc.setQueriesData({ queryKey: POST_QK.base() }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.filter((p: Post) => p.id !== id),
            total: prev.total - 1,
          }
        })
      },
    }),
}
