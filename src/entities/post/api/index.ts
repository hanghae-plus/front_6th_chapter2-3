import { apiClient } from "../../../shared/api/base"

import { usePostStore } from "../model/store"
import { Post } from "../model/types"

export const usePostApi = () => {
  const { setLoading, setPosts, setTotal, addPost, updatePost, removePost } = usePostStore()

  /** 게시물 목록 가져오기 */
  const fetchPosts = async (limit: number, skip: number) => {
    setLoading(true)
    try {
      const postsData = await apiClient.get<{ posts: Post[]; total: number }>(`/posts?limit=${limit}&skip=${skip}`)
      const usersData = await apiClient.get<{ users: any[] }>(`/users?limit=0&select=username,image`)

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((u) => u.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (err) {
      console.error("게시물 가져오기 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  /** 게시물 검색 */
  const searchPosts = async (searchQuery: string) => {
    setLoading(true)
    try {
      if (!searchQuery) return fetchPosts(10, 0)

      const data = await apiClient.get<{ posts: Post[]; total: number }>(
        `/posts/search?q=${encodeURIComponent(searchQuery)}`,
      )
      setPosts(data.posts)
      setTotal(data.total)
    } catch (err) {
      console.error("게시물 검색 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  /** 태그별 게시물 가져오기 */
  const fetchPostsByTag = async (tag: string) => {
    setLoading(true)
    try {
      if (!tag || tag === "all") return fetchPosts(10, 0)

      const [postsData, usersData] = await Promise.all([
        apiClient.get<{ posts: Post[]; total: number }>(`/posts/tag/${tag}`),
        apiClient.get<{ users: any[] }>(`/users?limit=0&select=username,image`),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((u) => u.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (err) {
      console.error("태그별 게시물 가져오기 오류:", err)
    } finally {
      setLoading(false)
    }
  }

  // 게시물 추가
  const addPostApi = async (newPost: Post) => {
    try {
      const data = await apiClient.post<Post>("/posts/add", newPost)
      addPost(data)
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePostApi = async (updatedPost: Post) => {
    try {
      const data = await apiClient.put<Post>(`/posts/${updatedPost.id}`, updatedPost)
      updatePost(data)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePostApi = async (id: number) => {
    try {
      await apiClient.delete(`/posts/${id}`)
      removePost(id)
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  return { fetchPosts, searchPosts, fetchPostsByTag, addPostApi, updatePostApi, deletePostApi }
}
