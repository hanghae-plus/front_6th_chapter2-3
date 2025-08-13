import { mutationOptions, QueryClient } from "@tanstack/react-query"
import { createPost, updatePost, deletePost } from "@/features/post/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { PostPaginatedResponse, Post, UpdatePost } from "@/shared/types"

export const postMutations = {
  create: (qc: QueryClient) =>
    mutationOptions({
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

  update: (qc: QueryClient) =>
    mutationOptions({
      mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePost(id, data),
      onSuccess: (updatedPost: Post) => {
        qc.setQueriesData({ queryKey: POST_QK.list({}) }, (prev: PostPaginatedResponse) => {
          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
          }
        })
      },
      onError: (error, variables, context) => {
        console.error("게시물 업데이트 실패:", error)
        console.error("전달된 변수:", variables)
        console.error("컨텍스트:", context)
      },
    }),

  remove: (qc: QueryClient, id: number) =>
    mutationOptions({
      mutationFn: (id: number) => deletePost(id),
      onSuccess: () => {
        // 상세 캐시 제거
        qc.removeQueries({ queryKey: POST_QK.detail(id) })

        // 모든 관련 쿼리에서 해당 포스트 제거
        qc.setQueriesData({ queryKey: POST_QK.list({}) }, (prev: PostPaginatedResponse) => {
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
