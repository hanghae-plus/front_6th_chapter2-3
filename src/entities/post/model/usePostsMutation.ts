import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query"
import { postsApi } from "../api/postsApi"
import { Post, NewPost } from "../../../types"

// 게시물 추가
export const useAddPost = (options?: Omit<UseMutationOptions<Post, Error, NewPost>, "mutationFn">) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.addPost,
    onSuccess: () => {
      // 게시물 관련 쿼리들을 무효화하여 최신 데이터로 갱신
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["postsWithUsers"] })
      queryClient.invalidateQueries({ queryKey: ["postsByTag"] })
    },
    ...options,
  })
}

// 게시물 수정
export const useUpdatePost = (
  options?: Omit<UseMutationOptions<Post, Error, { id: number; postData: Partial<Post> }>, "mutationFn">,
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, postData }: { id: number; postData: Partial<Post> }) => postsApi.updatePost(id, postData),
    onSuccess: () => {
      // 게시물 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["postsWithUsers"] })
      queryClient.invalidateQueries({ queryKey: ["postsByTag"] })
    },
    onError: (error) => {
      console.error("useUpdatePost - 에러 발생:", error)
    },
    ...options,
  })
}

// 게시물 삭제
export const useDeletePost = (options?: Omit<UseMutationOptions<void, Error, number>, "mutationFn">) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      // 게시물 관련 쿼리들을 무효화
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      queryClient.invalidateQueries({ queryKey: ["postsWithUsers"] })
      queryClient.invalidateQueries({ queryKey: ["postsByTag"] })
    },
    onError: (error) => {
      console.error("useDeletePost - 에러 발생:", error)
    },
    ...options,
  })
}
