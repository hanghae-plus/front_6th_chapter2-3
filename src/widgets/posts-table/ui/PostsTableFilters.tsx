import { Dispatch, SetStateAction } from "react"

import { useGetTags } from "@/entities/post/hook/useTagApi"
import { PostSearchParams } from "@/entities/post/model"
import { ActiveFilters, SearchControls } from "@/features/search-management/ui"

interface PostsTableFiltersProps {
  searchCondition: PostSearchParams
  searchInput: string
  setSearchCondition: Dispatch<SetStateAction<PostSearchParams>>
  setSearchInput: Dispatch<SetStateAction<string>>
}

export const PostsTableFilters = ({
  searchCondition,
  searchInput,
  setSearchCondition,
  setSearchInput,
}: PostsTableFiltersProps) => {
  const { data: tags } = useGetTags()

  // 검색어 변경 핸들러 (엔터 시에만 적용)
  const handleSearchSubmit = () => {
    // searchInput이 undefined이거나 빈 문자열일 때 처리
    const trimmedSearch = (searchInput || "").trim()

    setSearchCondition((prev) => ({
      ...prev,
      search: trimmedSearch,
      skip: 0,
      // 검색어가 있을 때만 다른 필터 초기화
      tag: trimmedSearch ? "all" : prev.tag,
      sortBy: trimmedSearch ? "none" : prev.sortBy,
      order: trimmedSearch ? "asc" : prev.order,
    }))
  }

  // 검색어 입력 핸들러
  const handleSearchInputChange = (value: string) => {
    setSearchInput(value || "") // undefined 방지
  }

  // 엔터키 핸들러
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  // 정렬 변경 핸들러
  const handleSortByChange = (value: string) => {
    const sortValue = value === "none" ? "none" : value
    setSearchCondition((prev) => ({
      ...prev,
      sortBy: sortValue,
      skip: 0,
      // 정렬 선택 시 검색어와 태그 초기화 (검색어가 있을 때만)
      search: sortValue !== "none" && prev.search ? "" : prev.search,
      tag: sortValue !== "none" && prev.search ? "all" : prev.tag,
    }))
    // 정렬 변경 시 검색 입력도 초기화 (검색어가 있을 때만)
    if (sortValue !== "none" && searchCondition.search) {
      setSearchInput("")
    }
  }

  // 정렬 순서 변경 핸들러
  const handleSortOrderChange = (value: string) => {
    setSearchCondition((prev) => ({
      ...prev,
      order: value,
      skip: 0,
    }))
  }

  // 태그 변경 핸들러
  const handleTagChange = (value: string) => {
    const tagValue = value === "all" ? "all" : value
    setSearchCondition((prev) => ({
      ...prev,
      tag: tagValue,
      skip: 0,
      // 태그 선택 시 검색어와 정렬 초기화 (검색어가 있을 때만)
      search: tagValue !== "all" && prev.search ? "" : prev.search,
      sortBy: tagValue !== "all" && prev.search ? "none" : prev.sortBy,
      order: tagValue !== "all" && prev.search ? "asc" : prev.order,
    }))
    // 태그 변경 시 검색 입력도 초기화 (검색어가 있을 때만)
    if (tagValue !== "all" && searchCondition.search) {
      setSearchInput("")
    }
  }

  return (
    <>
      {/* 검색 및 필터 컨트롤 */}
      <SearchControls
        onKeyPressDown={handleKeyPress}
        onSearchInputChange={handleSearchInputChange}
        onSearchSubmit={handleSearchSubmit}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
        onTagChange={handleTagChange}
        searchCondition={searchCondition}
        searchInput={searchInput || ""} // undefined 방지
        tags={tags}
      />

      {/* 현재 활성화된 필터 표시 */}
      <ActiveFilters searchCondition={searchCondition} />
    </>
  )
}
