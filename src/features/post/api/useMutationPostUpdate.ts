import { queryClient } from "@/app/config/tanstack.query"
import { putPost } from "@/entities/Post/api"
import { Post, PostList, updatePosts } from "@/entities/Post"
import { useMutation } from "@tanstack/react-query"

export function useMutationPostUpdate() {
  return useMutation({
    mutationFn: (post: Post) => putPost(post.id, post),
    onMutate(post) {
      queryClient.setQueriesData<PostList>(
        { queryKey: ["posts"] }, //
        (postList) => updatePosts(postList, post),
      )
    },
    onSuccess() {
      // queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError(error) {
      console.error("게시물 업데이트 오류:", error)
    },
  })
}
