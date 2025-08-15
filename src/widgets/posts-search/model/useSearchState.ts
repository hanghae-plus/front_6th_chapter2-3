import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { buildSearchParams, parseSearchParams, SearchParams } from '../lib/url-utils'

export const useSearchState = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // URL에서 초기값 읽기
  const initialParams = parseSearchParams(location.search)
  const [searchQuery, setSearchQuery] = useState(initialParams.search)
  const [selectedTag, setSelectedTag] = useState(initialParams.tag)
  const [sortBy, setSortBy] = useState(initialParams.sortBy)
  const [sortOrder, setSortOrder] = useState(initialParams.sortOrder)

  // URL 업데이트 함수
  const updateURL = (params?: Partial<SearchParams>) => {
    const searchParams: SearchParams = {
      search: params?.search ?? searchQuery,
      tag: params?.tag ?? selectedTag,
      sortBy: params?.sortBy ?? sortBy,
      sortOrder: params?.sortOrder ?? sortOrder,
    }
    
    const queryString = buildSearchParams(searchParams, location.search)
    navigate(`?${queryString}`)
  }

  // 검색 실행
  const handleSearch = () => {
    updateURL()
  }

  // 태그 선택 처리
  const handleSelectTag = (tag: string) => {
    const newTag = tag === 'all' ? '' : tag
    setSelectedTag(newTag)
    updateURL({ tag: newTag })
  }

  // 정렬 변경 처리
  const handleSortChange = (newSortBy: string, newSortOrder?: string) => {
    setSortBy(newSortBy)
    if (newSortOrder) {
      setSortOrder(newSortOrder)
    }
    updateURL({ sortBy: newSortBy, sortOrder: newSortOrder || sortOrder })
  }

  // 정렬 변경 시 즉시 URL 업데이트
  useEffect(() => {
    updateURL()
  }, [sortBy, sortOrder])

  return {
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSearch,
    handleSelectTag,
    handleSortChange,
  }
}