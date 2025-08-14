import { useQuery } from "@tanstack/react-query"
import { fetchComments } from "../../../entities/comment/api"

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
    staleTime: Infinity, // 캐시 값을 유지하기 위해 staleTime을 Infinity로 설정합니다.
  })
}
