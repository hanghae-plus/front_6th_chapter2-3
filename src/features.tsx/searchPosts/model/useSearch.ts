import { useState } from "react"
import { usePostStore } from "../../../entities/post/model/store"

export const useSearch = () => {
  const { searchPosts } = usePostStore()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchPost = async () => {
    await searchPosts(searchQuery)
  }

  return {
    searchQuery,
    setSearchQuery,
    searchPosts: handleSearchPost,
  }
}
