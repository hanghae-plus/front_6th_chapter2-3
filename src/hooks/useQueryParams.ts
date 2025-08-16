import { useTags } from "./useTags"
import { atom } from "jotai"
import { useAtom } from "jotai"
import { useLocation, useNavigate } from "react-router-dom"

const skipAtom = atom(0)
const limitAtom = atom(10)
const sortByAtom = atom("")
const sortOrderAtom = atom("asc")
const searchQueryAtom = atom("")
const searchQueryKeywordAtom = atom("")

export function useQueryParams() {
  const location = useLocation()
  const navigate = useNavigate()

  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [searchQueryKeyword, setSearchQueryKeyword] = useAtom(searchQueryKeywordAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)
  const { selectedTag, setSelectedTag } = useTags()

  // URL 업데이트 함수
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

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    updateURL,
    searchQueryKeyword,
    setSearchQueryKeyword,
  }
}
