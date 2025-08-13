import { useState, useCallback } from "react"
import { useTagStore } from "../../../entities/tag/model/store"
import { usePostStore } from "../../../entities/post/model/store"

export const useFilter = () => {
  const { setSelectedTag, getTags } = useTagStore()
  const { fetchPostsByTag } = usePostStore()

  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const handleGetTags = useCallback(async () => {
    await getTags()
  }, [getTags])

  const handleTagChange = useCallback(
    async (tag: string) => {
      setSelectedTag(tag)
      await fetchPostsByTag(tag)
    },
    [setSelectedTag, fetchPostsByTag],
  )

  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleGetTags,
    handleTagChange,
  }
}
