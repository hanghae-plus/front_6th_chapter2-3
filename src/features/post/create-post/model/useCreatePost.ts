import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { createPost as createPostApi } from "@/entities/post/api"
import { getUserById } from "@/entities/user/api"
import { POST_QK } from "@/entities/post/model"
import { PostPaginatedResponse, PostWithAuthor, CreatePost } from "@/entities/post/model"

export const useCreatePost = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
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
      queryClient.setQueriesData(
        {
          queryKey: POST_QK.list({
            limit: Number(searchParams.get("limit")) || 10,
            skip: Number(searchParams.get("skip")) || 0,
            search: searchParams.get("search") || "",
            tag: searchParams.get("tag") || "",
            sortBy: (searchParams.get("sortBy") as "id" | "title" | "reactions" | "none") || "none",
            sortOrder: (searchParams.get("sortOrder") as "desc" | "asc") || "desc",
          }),
        },
        (old: PostPaginatedResponse | undefined) => {
          console.log("createPost", old)
          if (!old) return old

          // 새 게시글을 첫 번째 페이지에 추가
          return {
            ...old,
            posts: [newPost, ...old.posts],
            total: old.total + 1,
          }
        },
      )
    },
  })
  return { createPost, isPending, error }
}
