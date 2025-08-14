import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost as createPostApi } from "@/entities/post/api"
import { getUserById } from "@/entities/user/api"
import { POST_QK } from "@/entities/post/model/query-key"
import { PostPaginatedResponse, PostWithAuthor, CreatePost } from "@/entities/post/model/types"

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const {
    mutate: createPost,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: CreatePost) => {
      // 게시글 생성
      const newPost = await createPostApi(data)

      // 사용자 정보가 없으면 가져오기
      if (!data.author && newPost.userId) {
        try {
          const author = await getUserById(newPost.userId)
          return { ...newPost, author } as PostWithAuthor
        } catch (error) {
          console.warn("사용자 정보를 가져올 수 없습니다:", error)
          return newPost
        }
      }

      return { ...newPost, author: data.author } as PostWithAuthor
    },
    onSuccess: (newPost: PostWithAuthor) => {
      queryClient.setQueriesData({ queryKey: POST_QK.list({}) }, (old: PostPaginatedResponse) => {
        console.log("createPost", old)

        return {
          ...old,
          posts: [...old.posts, newPost],
          total: old.total + 1,
        }
      })
    },
  })
  return { createPost, isPending, error }
}
