import { useAtom } from "jotai"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { selectedTagAtom, sortByAtom, sortOrderAtom, skipAtom, limitAtom } from "../../../store/postsAtoms"
import { usePostSearch } from "./usePostSearch"
import { useTags } from "../api"

export const usePostFilters = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { searchQuery, setSearchQuery } = usePostSearch()
  const [selectedTag, setSelectedTag] = useAtom(selectedTagAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)

  // TanStack Query 훅 사용
  const tagsQuery = useTags()
  const tags = tagsQuery.data || []

  const updateURL = () => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    updateURL()
  }

  const handleSkipChange = (newSkip: number) => setSkip(newSkip)
  const handleLimitChange = (newLimit: number) => setLimit(newLimit)

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag, searchQuery])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSearchQuery, setSortBy, setSortOrder, setSelectedTag, setSkip, setLimit])

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    skip,
    limit,
    tags,
    handleTagChange,
    handleSkipChange,
    handleLimitChange,
  }
}
