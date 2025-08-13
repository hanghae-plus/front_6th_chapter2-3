import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { createPost, updatePost, deletePost } from "@/features/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { PostPaginatedResponse, Post } from "@/shared/types"

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
      onSuccess: (newPost) => {
        console.log(newPost)
        console.log("포스트 생성 성공")

        // 1. withAuthor가 포함된 쿼리들 (작성자 정보 포함)
        qc.setQueriesData({ queryKey: POST_QK.base() }, (old: PostPaginatedResponse | undefined) => {
          if (!old?.posts) return old
          return {
            ...old,
            posts: [newPost, ...old.posts],
            total: old.total + 1,
          }
        })

        // 3. 태그별 쿼리들 (해당 태그가 있는 경우)
        if (newPost.tags && newPost.tags.length > 0) {
          newPost.tags.forEach((tag) => {
            qc.setQueriesData(
              { queryKey: [...POST_QK.base(), "byTag", tag] },
              (old: PostPaginatedResponse | undefined) => {
                if (!old?.posts) return old
                return {
                  ...old,
                  posts: [newPost, ...old.posts],
                  total: old.total + 1,
                }
              },
            )
          })
        }

        // 4. 검색 쿼리들 (제목이나 내용에 검색어가 포함된 경우)
        qc.setQueriesData({ queryKey: [...POST_QK.base(), "search"] }, (old: PostPaginatedResponse | undefined) => {
          if (!old?.posts) return old
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
      mutationFn: ({ id, data }: { id: number; data: Partial<unknown> }) => updatePost(id, data),
      onSuccess: (updated) => {
        // 상세는 바로 반영(네트워크 절약)
        qc.setQueryData(POST_QK.detail(updated.id), updated)

        // 모든 관련 쿼리에서 해당 포스트 업데이트
        qc.setQueriesData({ queryKey: POST_QK.base() }, (prev: PostPaginatedResponse | undefined) => {
          if (!prev?.posts) return prev
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === updated.id ? { ...p, ...updated } : p)),
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
