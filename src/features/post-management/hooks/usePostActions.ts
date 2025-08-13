import { useState } from "react"

import { postApi } from "@/entities/post/api"
import type { Post } from "@/entities/post/model"

export const usePostActions = () => {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })

  const addPost = async (posts: Post[], setPosts: (posts: Post[]) => void) => {
    try {
      const data = await postApi.createPost(newPost)
      setPosts([data, ...posts])
      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const updatePost = async (posts: Post[], setPosts: (posts: Post[]) => void) => {
    if (!selectedPost) return
    try {
      const data = await postApi.updatePost(selectedPost.id, selectedPost)
      setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  const deletePost = async (id: number, posts: Post[], setPosts: (posts: Post[]) => void) => {
    try {
      await postApi.deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return {
    showAddDialog,
    setShowAddDialog,
    showEditDialog,
    setShowEditDialog,
    selectedPost,
    setSelectedPost,
    newPost,
    setNewPost,
    addPost,
    updatePost,
    deletePost,
  }
}
