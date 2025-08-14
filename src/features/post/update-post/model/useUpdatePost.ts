import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePost as updatePostApi } from "@/entities/post/api"
import { POST_QK } from "@/entities/post/model"
import { Post, PostPaginatedResponse, UpdatePost } from "@/entities/post/model"

export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  const {
    mutate: updatePost,
    isPending,
    error,
  } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePostApi(id, data),
    onSuccess: (updatedPost: Post) => {
      // 모든 posts 리스트 쿼리에 대해 캐시 업데이트
      // exact: false를 사용해서 ["posts", "list"]로 시작하는 모든 쿼리를 찾음
      queryClient.setQueriesData(
        { queryKey: ["posts", "list"], exact: false },
        (prev: PostPaginatedResponse | undefined) => {
          if (!prev) return prev

          return {
            ...prev,
            posts: prev.posts.map((p: Post) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
          }
        },
      )

      // 기존 방식도 유지 (하위 호환성)
      queryClient.setQueriesData({ queryKey: POST_QK.list({}) }, (prev: PostPaginatedResponse | undefined) => {
        if (!prev) return prev

        return {
          ...prev,
          posts: prev.posts.map((p: Post) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)),
        }
      })
    },
  })

  return { updatePost, isPending, error }
}
