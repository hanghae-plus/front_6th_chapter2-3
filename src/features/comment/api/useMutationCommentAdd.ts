import { queryClient } from "@/app/config/tanstack.query"
import { addComment } from "@/entities/Comment/api"
import { addCommentsOfPost, CommentInput, CommentsOfPost, initialCommentsOfPost } from "@/entities/Comment"
import { useMutation } from "@tanstack/react-query"

export function useMutationCommentAdd() {
  return useMutation({
    mutationFn: (commentInput: CommentInput) => addComment(commentInput),
    onMutate(commentInput) {
      queryClient.setQueryData(
        ["posts", commentInput.postId, "comments"],
        (commentsOfPost: CommentsOfPost = initialCommentsOfPost) => {
          return addCommentsOfPost(commentsOfPost, commentInput)
        },
      )

      return { commentInput }
    },
    onSuccess() {
      // 낙관적 업데이트 후 캐시 무효화
      // queryClient.invalidateQueries({ queryKey: ["posts", data.postId, "comments"] })
    },
    onError(error) {
      console.error("댓글 추가 오류:", error)
    },
  })
}
