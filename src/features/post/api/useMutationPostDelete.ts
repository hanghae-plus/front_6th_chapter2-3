import { deletePost } from "@/entities/Post/api"
import { PostId, PostList, removePost } from "@/entities/Post"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useMutationPostDelete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: PostId) => deletePost(postId),
    onMutate(postId) {
      queryClient.setQueriesData<PostList>(
        { queryKey: ["posts"] }, //
        (postList) => removePost(postList, postId),
      )
      return { postId }
    },
    onSuccess(_, postId) {
      // 게시물 삭제 성공 후 캐시 무효화
      // queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError(error) {
      console.error("게시물 삭제 오류:", error)
    },
  })
}
