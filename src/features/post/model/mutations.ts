import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { createPost, updatePost, deletePost } from "@/features/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { PostFilter, PostPaginatedResponse } from "@/shared/types"
import { Post } from "@/shared/types"

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
      onSuccess: () => {
        // 리스트/합성쿼리 모두 리프레시
        qc.invalidateQueries({ queryKey: POST_QK.all() })
      },
    }),

  update: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: postMutations.keys.base(),
      mutationFn: ({ id, data }: { id: number; data: Partial<unknown> }) => updatePost(id, data),
      onSuccess: (updated) => {
        // 상세는 바로 반영(네트워크 절약) + 리스트는 부분 업데이트 or 무효화
        qc.setQueryData(POST_QK.detail(updated.id), updated)
        qc.setQueriesData({ queryKey: POST_QK.list({} as PostFilter).slice(0, 2) }, (prev: PostPaginatedResponse) =>
          prev?.posts
            ? { ...prev, posts: prev.posts.map((p: Post) => (p.id === updated.id ? { ...p, ...updated } : p)) }
            : prev,
        )
      },
    }),

  remove: (qc: QueryClient) =>
    mutationOptions({
      mutationKey: postMutations.keys.base(),
      mutationFn: (id: number) => deletePost(id),
      onSuccess: (_void, id) => {
        // 상세 캐시 제거 + 모든 리스트에서 해당 항목 제거
        qc.removeQueries({ queryKey: POST_QK.detail(id) })
        qc.setQueriesData({ queryKey: POST_QK.base() }, (prev: PostPaginatedResponse) =>
          prev?.posts ? { ...prev, posts: prev.posts.filter((p: Post) => p.id !== id) } : prev,
        )
      },
    }),
}
