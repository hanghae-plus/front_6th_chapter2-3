import { patchComment } from "@/entities/Comment/api"
import { Comment, CommentsOfPost, updateCommentOfPost } from "@/entities/Comment"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useMutationCommentLike() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: Comment) => patchComment(comment.id, { likes: comment.likes + 1 }),
    onMutate(comment) {
      queryClient.setQueryData(
        ["posts", comment.postId, "comments"], //
        (commentsOfPost: CommentsOfPost) =>
          updateCommentOfPost(commentsOfPost, comment.id, { likes: comment.likes + 1 }),
      )

      return { comment }
    },
    onSuccess(_, comment) {
      // 낙관적 업데이트 후 캐시 무효화
      // @NOTE: 원래는 해야하는데 dummy 데이터라서 무효화 안함
      // queryClient.invalidateQueries({ queryKey: ["posts", comment.postId, "comments"] })
    },
    onError: (error) => {
      console.error("댓글 좋아요 오류:", error)
    },
  })
}
