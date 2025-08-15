import { useQuery } from '@tanstack/react-query'
import { commentApi } from '../api'
import { CommentsResponse } from './types'

// 게시물별 댓글 조회
export const useCommentsByPost = (postId: number) => {
  return useQuery<CommentsResponse>({
    queryKey: ['comments', 'post', postId],
    queryFn: () => commentApi.getCommentsByPost(postId),
    enabled: !!postId,
  })
}

// 단일 댓글 조회
export const useComment = (id: number) => {
  return useQuery({
    queryKey: ['comments', 'detail', id],
    queryFn: () => commentApi.getComment(id),
    enabled: !!id,
  })
}
