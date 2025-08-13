import { useState } from "react"
import { usePostStore } from "../../../entities/post/model/store"
import { CreatePostRequest, Post } from "../../../entities/post/model/types"
import { usePostApi } from "../../../entities/post/api"

// (비즈니스 로직만)
export const usePostManagement = () => {
  const { setSelectedPost } = usePostStore()
  const { addPostApi, deletePostApi, updatePostApi } = usePostApi()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: "",
    body: "",
    userId: 1,
  })

  const handleAddPost = async () => {
    try {
      await addPostApi(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleUpdatePost = async (post: Post) => {
    try {
      await updatePostApi(post)
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePostApi(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  const openEditDialog = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  return {
    showAddDialog,
    showEditDialog,
    newPost,
    setShowAddDialog,
    setShowEditDialog,
    setNewPost,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    openEditDialog,
  }
}
