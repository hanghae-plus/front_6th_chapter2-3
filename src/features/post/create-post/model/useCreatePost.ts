import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost as createPostApi } from "@/entities/post/api"
import { getUserById } from "@/entities/user/api"
import { PostWithAuthor, CreatePost } from "@/entities/post/model"

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
    onSuccess: () => {
      // 새 게시글 추가 후 모든 posts 리스트 쿼리를 무효화
      // 이렇게 하면 백엔드에서 최신 데이터를 가져와서 페이지네이션과 필터링이 올바르게 작동
      queryClient.invalidateQueries({ queryKey: ["posts", "list"] })

      console.log("createPost: 모든 posts 리스트 쿼리 무효화됨")
    },
  })
  return { createPost, isPending, error }
}
