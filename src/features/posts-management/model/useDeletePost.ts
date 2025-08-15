import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deletePostApi } from "../../../entities/posts/api"

export const useDeletePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("게시물 삭제 오류:", error)
    },
  })
}
