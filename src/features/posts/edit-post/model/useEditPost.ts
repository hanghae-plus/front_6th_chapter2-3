import { useQueryClient } from "@tanstack/react-query"
import { usePostDialogs } from "../../../../shared/store"
import type { Post } from "../../../../entities/posts/api/types"
import { useSelectedPost } from "../../model"
import { useUpdatePostMutation, useDeletePostMutation, postsKeys } from "../../model/queries"

export const useEditPost = () => {
  const { setSelectedPost } = useSelectedPost()
  const { setShowEditDialog } = usePostDialogs()
  const updatePostMutation = useUpdatePostMutation()
  const deletePostMutation = useDeletePostMutation()
  const queryClient = useQueryClient()

  const updatePost = async (selectedPost: Post) => {
    if (!selectedPost) return
    try {
      await updatePostMutation.mutateAsync({ id: selectedPost.id, post: selectedPost })
      
      // 성공 시 처리
      setShowEditDialog(false)
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    }
  }

  const deletePost = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync(postId)
      
      // 성공 시 처리
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
      // 실패 시 롤백
      queryClient.invalidateQueries({ queryKey: postsKeys.lists() })
    }
  }

  const openEditDialog = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  return { 
    updatePost, 
    deletePost, 
    openEditDialog,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending
  }
}
