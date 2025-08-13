import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost, updatePost, deletePost } from "@/features/post/api"
import { POST_QUERY_KEYS, type CreatePost, type UpdatePost } from "@/entities/post/model"

/**
 * 게시물 생성 뮤테이션 훅
 * @returns 게시물 생성 뮤테이션 객체
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePost) => createPost(data),
    onSuccess: (newPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 새 게시물을 캐시에 추가
      queryClient.setQueryData(POST_QUERY_KEYS.detail(newPost.id), newPost)
    },
    onError: (error) => {
      console.error("게시물 생성 실패:", error)
    },
  })
}

/**
 * 게시물 수정 뮤테이션 훅
 * @returns 게시물 수정 뮤테이션 객체
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePost }) => updatePost(id, data),
    onSuccess: (updatedPost) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 수정된 게시물 캐시 업데이트
      queryClient.setQueryData(POST_QUERY_KEYS.detail(updatedPost.id), updatedPost)
    },
    onError: (error) => {
      console.error("게시물 수정 실패:", error)
    },
  })
}

/**
 * 게시물 삭제 뮤테이션 훅
 * @returns 게시물 삭제 뮤테이션 객체
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, deletedId) => {
      // 게시물 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: POST_QUERY_KEYS.lists() })

      // 삭제된 게시물 캐시 제거
      queryClient.removeQueries({ queryKey: POST_QUERY_KEYS.detail(deletedId) })
    },
    onError: (error) => {
      console.error("게시물 삭제 실패:", error)
    },
  })
}
