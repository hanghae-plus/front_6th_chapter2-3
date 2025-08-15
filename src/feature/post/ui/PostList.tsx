import { useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { getTags, getUser, Tags } from "../../../entities"
import { userPostInfo, useSearchQueryStore, useSelectedUserStore } from "../model"
import { Author, CardContent, QUERY_KEYS, useURL, Pagination } from "../../../shared"
import { PostSearchFilter } from "./PostSearchFilter"
import { PostTable } from "./PostTable"

export const PostList = () => {
  const queryClient = useQueryClient()
  const [tags, setTags] = useState<Tags>([])
  const { setSelectedUser, setShowUserModal } = useSelectedUserStore()
  const { searchQuery, setSearchQuery } = useSearchQueryStore()
  const {
    skip,
    limit,
    sortBy,
    sortOrder,
    selectedTag,
    setSkip,
    setLimit,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    updateURL,
  } = useURL()
  const { loading, total, setActiveSearchQuery, posts } = userPostInfo(limit, skip, sortBy, sortOrder, selectedTag)
  // 태그 가져오기
  const { data: tagsData } = useQuery({
    queryKey: QUERY_KEYS.getTags(),
    queryFn: async () => {
      const { result, data: tags } = await getTags()
      return result && tags ? tags : []
    },
    staleTime: 0,
    gcTime: 0,
  })

  useEffect(() => {
    if (tagsData) {
      setTags(tagsData)
    }
  }, [tagsData])

  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  const handleSearchPost = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setActiveSearchQuery(searchQuery)
    }
  }

  const handleChangeTag = (value: string) => {
    setSelectedTag(value)
    updateURL()
  }

  // 사용자 모달 열기
  const openUserModal = async (user: Author) => {
    const userData = await queryClient.fetchQuery({
      queryKey: QUERY_KEYS.getUser(user.id),
      queryFn: async () => {
        const { result, data } = await getUser(user.id)
        if (result && data) return data
        throw new Error("사용자 정보를 가져올 수 없습니다")
      },
      staleTime: 5 * 60 * 1000,
    })

    setSelectedUser(userData)
    setShowUserModal(true)
  }

  const postTableProps = {
    searchQuery,
    selectedTag,
    setSelectedTag,
    updateURL,
    openUserModal,
    posts,
  }

  const paginationProps = {
    limit,
    setLimit,
    total,
    skip,
    setSkip,
  }

  const filterProps = {
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    tags,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    handleChangeTag,
    handleSearchPost,
  }

  return (
    <>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostSearchFilter {...filterProps} />

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable {...postTableProps} />}

          {/* 페이지네이션 */}
          <Pagination {...paginationProps}></Pagination>
        </div>
      </CardContent>
    </>
  )
}
