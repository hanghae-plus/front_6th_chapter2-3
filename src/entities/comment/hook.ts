import { useMutation, useQuery } from "@tanstack/react-query"
import { addComment, deleteComment, fetchComments, likeComment, updateComment } from "./api"
import { CommentRequest } from "./model"
import { Comment } from "./model"

const COMMENT_QUERY_KEY = {
  LIST: "comments",
}

/**
 * 댓글 목록 조회
 * @param postId - 게시물 ID
 * @returns 댓글 목록
 */
export const useCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: [COMMENT_QUERY_KEY.LIST, postId],
    queryFn: () => fetchComments(postId),
  })
}

/**
 * 댓글 추가
 * @returns 댓글 추가
 */
export const useAddCommentMutation = () => {
  return useMutation({
    mutationFn: (comment: CommentRequest) => addComment(comment),
  })
}

/**
 * 댓글 수정
 * @returns 댓글 수정
 */
export const useUpdateCommentMutation = () => {
  return useMutation({
    mutationFn: (comment: Comment) => updateComment(comment),
  })
}

/**
 * 댓글 삭제
 * @returns 댓글 삭제
 */
export const useDeleteCommentMutation = () => {
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
  })
}

/**
 * 댓글 좋아요
 * @returns 댓글 좋아요
 */
export const useLikeCommentMutation = () => {
  return useMutation({
    mutationFn: (commentId: number) => likeComment(commentId),
  })
}
