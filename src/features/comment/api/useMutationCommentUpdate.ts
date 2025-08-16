import { patchComment } from "@/entities/Comment/api"
import { Comment, CommentsOfPost, updateCommentOfPost } from "@/entities/Comment"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useMutationCommentUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: Comment) => patchComment(comment.id, { body: comment.body }),
    onMutate(comment) {
      queryClient.setQueryData(
        ["posts", comment.postId, "comments"], //
        (commentsOfPost: CommentsOfPost) => updateCommentOfPost(commentsOfPost, comment.id, comment),
      )
      return { comment }
    },
    onSuccess(_, comment) {
      // 낙관적 업데이트 후 캐시 무효화
      // @NOTE: 원래는 해야하는데 dummy 데이터라서 무효화 안함
      // queryClient.invalidateQueries({ queryKey: ["posts", comment.postId, "comments"] })
    },
    onError(error) {
      console.error("댓글 수정 오류:", error)
    },
  })
}
