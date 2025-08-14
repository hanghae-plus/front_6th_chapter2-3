import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postsManagerApi } from '../api'
import { NewPost, UpdatePost, NewComment, UpdateComment } from './types'

// 게시물 추가 mutation
export const useAddPost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newPost: NewPost) => postsManagerApi.addPost(newPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 게시물 수정 mutation
export const useUpdatePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updateData }: { id: number; updateData: UpdatePost }) =>
      postsManagerApi.updatePost(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 게시물 삭제 mutation
export const useDeletePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postsManagerApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// 댓글 추가 mutation
export const useAddComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (newComment: NewComment) => postsManagerApi.addComment(newComment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', 'post', variables.postId] })
    },
  })
}

// 댓글 수정 mutation
export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updateData }: { id: number; updateData: UpdateComment }) =>
      postsManagerApi.updateComment(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

// 댓글 삭제 mutation
export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => postsManagerApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}

// 댓글 좋아요 mutation
export const useLikeComment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, likes }: { id: number; likes: number }) =>
      postsManagerApi.likeComment(id, likes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })
}
