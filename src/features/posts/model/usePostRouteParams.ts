import { SortBy, SortOrder } from "@/entities/Post/api"
import { useSelectedTag } from "@/features/tag/model/useSelectedTag.ts"
import { atom, useAtom } from "jotai"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const queryParams = new URLSearchParams(location.search)
const skipAtom = atom(parseInt(queryParams.get("skip") || "0"))
const limitAtom = atom(parseInt(queryParams.get("limit") || "10"))
const searchQueryAtom = atom(queryParams.get("search") || "")
const sortByAtom = atom<SortBy | undefined>(queryParams.get("sortBy") as SortBy | undefined)
const sortOrderAtom = atom<SortOrder | undefined>(queryParams.get("sortOrder") as SortOrder | undefined)

export const usePostRouteParams = () => {
  const navigate = useNavigate()

  const [skip, setSkip] = useAtom(skipAtom)
  const [limit, setLimit] = useAtom(limitAtom)
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom)
  const [sortBy, setSortBy] = useAtom(sortByAtom)
  const [sortOrder, setSortOrder] = useAtom(sortOrderAtom)

  const { selectedTag } = useSelectedTag()

  // URL 업데이트 함수
  useEffect(() => {
    const params = new URLSearchParams()
    if (skip) params.set("skip", skip.toString())
    if (limit) params.set("limit", limit.toString())
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }, [navigate, selectedTag, skip, limit, searchQuery, sortBy, sortOrder])

  return new (class {
    skip = skip
    setSkip = setSkip
    limit = limit
    setLimit = setLimit
    searchQuery = searchQuery
    setSearchQuery = setSearchQuery
    sortBy = sortBy
    setSortBy = setSortBy
    sortOrder = sortOrder
    setSortOrder = setSortOrder
  })()
}
