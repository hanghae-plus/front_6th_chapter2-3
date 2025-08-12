import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addPost, updatePost, deletePost } from './index'
import type { Post } from '../model/types'

// 게시물 생성
export const usePostPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      // 모든 게시물 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['posts', 'list'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'search'] })
      queryClient.invalidateQueries({ queryKey: ['posts', 'by-tag'] })
    },
  })
}

// 게시물 수정
export const usePutPost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, post }: { id: number; post: Partial<Post> }) => updatePost(id, post),
    onSuccess: () => {
      // 모든 게시물 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 게시물 삭제
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      // 모든 게시물 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}