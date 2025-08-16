import { fetchCommentsByPostId } from "@/entities/Comment/api"
import { PostId } from "@/entities/Post"
import { useQuery } from "@tanstack/react-query"

export function useQueryComments(postId: PostId) {
  return useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => fetchCommentsByPostId(postId),
  })
}
