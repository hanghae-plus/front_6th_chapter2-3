import { useQuery } from "@tanstack/react-query"
import { getPost } from "@/entities/post/api"
import { getUsers } from "@/entities/user/api"
import { Author, POST_QK } from "@/entities/post/model"

export const usePostDetail = (id: number) => {
  const { data, isLoading, error } = useQuery({
    queryKey: POST_QK.detail(id),
    queryFn: async () => {
      if (!id) throw new Error("Post ID is required")

      const [postResponse, usersResponse] = await Promise.all([getPost(id), getUsers()])

      const userMap = new Map(usersResponse.users.map((u) => [u.id, u]))

      const postWithAuthor = {
        ...postResponse,
        author: userMap.get(postResponse.userId) as Author,
      }

      return {
        post: postWithAuthor,
      }
    },
    enabled: !!id,
  })

  return { data, isLoading, error }
}
