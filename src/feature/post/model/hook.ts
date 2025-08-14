import { useState } from "react"
import { requestApi } from "../../../shared/lib"
import { useSelectedPostStore } from "./store"
import { DeletePost, NewPost, Post } from "../type"
import { getPosts, getPostsByTag, getSeachPosts, getUsers } from "../../../entities"

export const userPostInfo = () => {
  const { setPosts } = useSelectedPostStore()
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 게시물 가져오기
  const fetchPosts = async (limit: number, skip: number, sortBy: string) => {
    setLoading(true)

    try {
      const { result, data: posts } = await getPosts(limit, skip, sortBy)
      if (result && posts) {
        const { result, data: users } = await getUsers()
        if (result && users) {
          const postsWithUsers = posts.posts.map((post) => ({
            ...post,
            author: users.users.find((user) => user.id === post.userId),
          })) as Array<Post>

          setPosts(postsWithUsers)
          setTotal(posts.total)
        }
      }
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 검색
  const searchPosts = async (limit: number, skip: number, sortBy: string, searchQuery?: string) => {
    if (!searchQuery) {
      fetchPosts(limit, skip, sortBy)
      return
    }
    setLoading(true)
    try {
      const { result, data: postsData } = await getSeachPosts(searchQuery)

      if (result && postsData) {
        setPosts(postsData.posts)
        setTotal(postsData.total)
      }
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (limit: number, skip: number, sortBy: string, tag: string | null) => {
    if (!tag || tag === "all") {
      fetchPosts(limit, skip, sortBy)
      return
    }
    setLoading(true)
    try {
      const { result: postResult, data: posts } = await getPostsByTag(tag)
      const { result: userResult, data: users } = await getUsers()

      if (postResult && posts && userResult && users) {
        const postsWithUsers = posts.posts.map((post) => ({
          ...post,
          author: users.users.find((user) => user.id === post.userId),
        }))

        setPosts(postsWithUsers)
        setTotal(posts.total)
      }
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  return {
    total,
    loading,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
  }
}

export const usePostForm = () => {
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
