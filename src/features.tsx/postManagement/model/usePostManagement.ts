import { useState } from "react"
import { usePostStore } from "../../../entities/post/model/store"
import { CreatePostRequest, Post } from "../../../entities/post/model/types"

// (비즈니스 로직만)
export const usePostManagement = () => {
  const { setSelectedPost, createPost, editPost, deletePost, error: postError } = usePostStore()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)

  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: "",
    body: "",
    userId: 1,
  })

  const handleAddPost = async () => {
    try {
      await createPost(newPost)
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("게시물 추가 처리 중 오류:", error)
    }
  }

  const handleUpdatePost = async (post: Post) => {
    try {
      await editPost(post.id, post)
      setShowEditDialog(false)
    } catch (error) {
      // 에러는 이미 store에서 처리됨
      console.error("게시물 업데이트 처리 중 오류:", error)
    }
  }

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id)
    } catch (error) {
      console.error("게시물 삭제 처리 중 오류:", error)
    }
  }

  const openEditDialog = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  return {
    showAddDialog,
    showEditDialog,
    showPostDetailDialog,
    newPost,
    postError,
    setShowAddDialog,
    setShowEditDialog,
    setShowPostDetailDialog,
    setNewPost,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    openEditDialog,
    openPostDetail,
  }
}
