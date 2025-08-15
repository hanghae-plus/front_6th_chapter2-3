import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPostApi } from "../../../entities/posts/api"

export const useAddPost = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      onSuccessCallback?.()
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })
}
