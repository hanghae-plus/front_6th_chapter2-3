import { useQueryClient } from "@tanstack/react-query"
import { usePostDialogs } from "../../../../shared/store"
import { useNewPost } from "../../model"
import { useAddPostMutation, postsKeys } from "../../model/queries"

export const useAddPost = () => {
  const { newPost, setNewPost } = useNewPost()
  const { setShowAddDialog } = usePostDialogs()
  const addPostMutation = useAddPostMutation()
  const queryClient = useQueryClient()

  const addPost = async () => {
    try {
      await addPostMutation.mutateAsync(newPost)
      
      // 성공 시 처리
      setNewPost({ title: "", body: "", userId: 1 })
      setShowAddDialog(false)
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    }
  }

  return { addPost, isLoading: addPostMutation.isPending }
}
