import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { commentApi } from "./commentApi"
import { Comment } from "../../../types"

// 특정 게시물의 댓글 가져오기
export const useCommentsByPost = (
  postId: number,
  options?: Omit<UseQueryOptions<{ comments: Comment[] }>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => commentApi.getCommentsByPost(postId),
    enabled: !!postId, // postId가 있을 때만 실행
    ...options,
  })
}
