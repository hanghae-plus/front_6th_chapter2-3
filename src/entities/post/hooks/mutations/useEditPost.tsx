import { POSTS_QUERY_KEY } from "@entities/post/const"
import { GetPostsResponse } from "@entities/post/hooks/queries/useGetPosts"
import { Post } from "@entities/post/types"
import { http } from "@shared/lib/api/http"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface EditPostBody {
  id: number
  title: string
  body: string
}

const editPost = async (post: EditPostBody) => {
  const { id, title, body } = post
  const response: Post = await http.put(`/posts/${id}`, { title, body })

  return response
}

export const useEditPost = () => {
  const queryClient = useQueryClient()

  return useMutation<Post, Error, EditPostBody>({
    mutationFn: editPost,
    onSuccess: (updatedPost, variables) => {
      // 모든 posts list 쿼리들을 업데이트
      queryClient.setQueriesData({ queryKey: POSTS_QUERY_KEY.lists() }, (oldData: GetPostsResponse) => {
        if (!oldData?.posts) return oldData

        return {
          ...oldData,
          posts: oldData.posts.map((post: Post) => (post.id === variables.id ? { ...post, ...updatedPost } : post)),
        }
      })
    },
  })
}
