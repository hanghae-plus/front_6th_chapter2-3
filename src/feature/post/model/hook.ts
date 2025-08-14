import { useState } from "react"
import { requestApi } from "../../../shared/lib"
import { useSelectedPostStore } from "./store"
import { DeletePost, NewPost, Post } from "../type"

export const usePost = () => {
  const { setShowAddDialog, setShowEditDialog, setPosts, posts, selectedPost, setSelectedPost } = useSelectedPostStore()
  const [newPost, setNewPost] = useState<NewPost>({ title: "", body: "", userId: 1 })

  const handleChangeNewPost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewPost((prev) => ({ ...prev, [name]: value }))
  }

  // 게시물 추가
  const addPost = async () => {
    try {
      const { result, data } = await requestApi<Post>(`/api/posts/add`, {
        method: "POST",
        body: newPost,
      })
      if (result && data) {
        setPosts([
          {
            ...data,
            reactions: { likes: 0, dislikes: 0 },
            tags: [],
            views: 0,
          },
          ...posts,
        ])
      }

      setShowAddDialog(false)
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  const handleChangeSelectedPost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedPost({ ...selectedPost, [name]: value })
  }

  // 게시물 업데이트
  const updatePost = async () => {
    try {
      const { result, data } = await requestApi<Post>(`/api/posts/${selectedPost.id}`, {
        method: "PUT",
        body: selectedPost,
      })
      if (result && data) {
        setPosts(posts.map((post) => (post.id === data.id ? data : post)))
      }

      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      const { result } = await requestApi<DeletePost>(`/api/posts/${id}`, {
        method: "DELETE",
      })
      if (result) {
        setPosts(posts.filter((post) => post.id !== id))
      }
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return {
    newPost,
    handleChangeNewPost,
    addPost,
    handleChangeSelectedPost,
    updatePost,
    deletePost,
  }
}
