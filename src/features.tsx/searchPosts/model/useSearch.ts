import { useState } from "react"

import { usePostApi } from "../../../entities/post/api"

export const useSearch = () => {
  const { searchPosts } = usePostApi()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchPost = async () => {
    await searchPosts(searchQuery)
  }

  return {
    searchQuery,
    setSearchQuery,
    handleSearchPost,
  }
}
