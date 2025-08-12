import { useState, useCallback } from "react"
import { useTagStore } from "../../../entities/tag/model/store"
import { usePostStore } from "../../../entities/post/model/store"
import { useTagApi } from "../../../entities/tag/api"

export const useFilter = () => {
  const { setTags, selectedTag, setSelectedTag } = useTagStore()
  const { setPosts, setTotal, setLoading } = usePostStore()
  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const fetchTags = useCallback(async () => {
    try {
      const tags = await useTagApi.getTags()
      setTags(tags)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }, [setTags])

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      if (!tag || tag === "all") {
        return
      }

      setLoading(true)
      try {
        const [postsData, usersData] = await Promise.all([
          postApi.getPostsByTag(tag),
          userApi.getUsers({ limit: 0, select: "username,image" }),
        ])

        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))

        setPosts(postsWithUsers)
        setTotal(postsData.total)
      } catch (error) {
        console.error("태그별 게시물 가져오기 오류:", error)
      }
      setLoading(false)
    },
    [setPosts, setTotal, setLoading],
  )

  const handleTagChange = useCallback(
    (tag: string) => {
      setSelectedTag(tag)
      fetchPostsByTag(tag)
    },
    [setSelectedTag, fetchPostsByTag],
  )

  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    fetchTags,
    handleTagChange,
  }
}
