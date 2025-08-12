import { useState } from "react"
import { usePostStore } from "../../../entities/post/model/store"
import { postApi } from "../../../entities/post/api/postApi"
import { userApi } from "../../../entities/user/api/userApi"

export const useSearch = () => {
  const { setPosts, setTotal, setLoading } = usePostStore()
  const [searchQuery, setSearchQuery] = useState("")

  const searchPosts = async () => {
    if (!searchQuery) return

    setLoading(true)
    try {
      const data = await postApi.searchPosts(searchQuery)
      const users = await userApi.getUsers({ limit: 0, select: "username,image" })

      const postsWithUsers = data.posts.map((post) => ({
        ...post,
        author: users.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(data.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    }
    setLoading(false)
  }

  return {
    searchQuery,
    setSearchQuery,
    searchPosts,
  }
}
