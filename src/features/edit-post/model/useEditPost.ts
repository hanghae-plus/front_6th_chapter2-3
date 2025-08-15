import { useSetAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updatePostApi, PostDTO } from "../../../entities/posts/api"
import { isEditPostModalOpenAtom } from "./atoms"

export const useEditPost = () => {
  const queryClient = useQueryClient()
  const setIsEditPostModalOpen = useSetAtom(isEditPostModalOpenAtom)

  return useMutation({
    mutationFn: (post: PostDTO) => updatePostApi({ selectedPost: post }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setIsEditPostModalOpen(false)
    },
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })
}
