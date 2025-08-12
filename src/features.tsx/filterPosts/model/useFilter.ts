import { useState, useCallback } from "react"
import { useTagStore } from "../../../entities/tag/model/store"
import { useTagApi } from "../../../entities/tag/api"
import { usePostApi } from "../../../entities/post/api"

export const useFilter = () => {
  const { setSelectedTag } = useTagStore()
  const { getTags } = useTagApi()
  const { getPostsByTag } = usePostApi()

  const [sortBy, setSortBy] = useState("")
  const [sortOrder, setSortOrder] = useState("asc")

  const handleGetTags = useCallback(async () => {
    await getTags()
  }, [getTags])

  const handleTagChange = useCallback(
    (tag: string) => {
      setSelectedTag(tag)

      getPostsByTag(tag)
    },
    [setSelectedTag, getPostsByTag],
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
