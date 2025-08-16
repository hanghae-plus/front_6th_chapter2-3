import { queryClient } from "@/app/config/tanstack.query"
import { deleteComment } from "@/entities/Comment/api"
import { CommentsOfPost, removeCommentOfPost, type Comment } from "@/entities/Comment"
import { useMutation } from "@tanstack/react-query"

export function useMutationCommentDelete() {
  return useMutation({
    mutationFn: (comment: Comment) => deleteComment(comment.id),
    onMutate(comment) {
      queryClient.setQueryData(
        ["posts", comment.postId, "comments"], //
        (commentsOfPost: CommentsOfPost) => removeCommentOfPost(commentsOfPost, comment.id),
      )
      return { comment }
    },
    onSuccess(_, comment) {
      // 낙관적 업데이트 후 캐시 무효화
      // @NOTE: 원래는 해야하는데 dummy 데이터라서 무효화 안함
      // queryClient.invalidateQueries({ queryKey: ["posts", comment.postId, "comments"] })
    },
    onError(error) {
      console.error("댓글 삭제 오류:", error)
    },
  })
}
