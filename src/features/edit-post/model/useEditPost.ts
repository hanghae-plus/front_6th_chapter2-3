import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePostApi, PostDTO } from "../../../entities/posts/api"

export const useEditPost = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { selectedPost: PostDTO }) => updatePostApi(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      onSuccessCallback?.()
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })
}
