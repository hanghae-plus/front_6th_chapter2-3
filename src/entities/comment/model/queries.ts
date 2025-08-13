import { useQuery } from "@tanstack/react-query"
import { getCommentsByPost, getCommentsByUser } from "@/entities/comment/api"
import { COMMENT_QUERY_KEYS } from "@/entities/comment/model/query-key"
import { CommentFilter } from "@/shared/types/comment.type"

// 특정 게시물의 댓글 목록 조회 훅
export const useCommentsByPost = (postId: number, filters?: CommentFilter) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.list(postId, filters),
    queryFn: () => getCommentsByPost(postId, filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!postId,
  })
}

// 특정 사용자의 댓글 목록 조회 훅
export const useCommentsByUser = (userId: number, filters?: CommentFilter) => {
  return useQuery({
    queryKey: COMMENT_QUERY_KEYS.user(userId, filters),
    queryFn: () => getCommentsByUser(userId, filters),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    enabled: !!userId,
  })
}
