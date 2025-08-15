import { useSetAtom } from "jotai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addPostApi } from "../../../entities/posts/api"
import { isAddPostModalOpenAtom } from "./atoms"

export const useAddPost = () => {
  const queryClient = useQueryClient()
  const setIsAddPostModalOpen = useSetAtom(isAddPostModalOpenAtom)

  return useMutation({
    mutationFn: addPostApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
      setIsAddPostModalOpen(false)
    },
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
  })
}
