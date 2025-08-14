import React, { useEffect, useState } from "react"
import { CardContent } from "../../shared/ui"
import PostSearchFilter from "./ui/PostSearchFilter"
import { Pagination } from "../../widgets"
import { PostTable } from "./ui/PostTable"
import { Post } from "./type"
import { getTags, Tags } from "../../entities"
import { getUser } from "../../entities"
import { Author } from "../../shared/types"
import { useSearchQueryStore, useSelectedPostStore, useSelectedUserStore } from "./model/store"
import { useURL } from "../../shared/hook/useURL"
import { userPostInfo } from "./model/hook"
import { useComment } from "../comment/model/hook"

export const PostList = () => {
  const [tags, setTags] = useState<Tags>([])
  const { fetchComments } = useComment()
  const { setSelectedPost, setShowPostDetailDialog } = useSelectedPostStore()
  const { setSelectedUser, setShowUserModal } = useSelectedUserStore()
  const { searchQuery, setSearchQuery } = useSearchQueryStore()
  const { loading, total, fetchPosts, searchPosts, fetchPostsByTag } = userPostInfo()
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

  useEffect(() => {
    fetchTags()
  }, [])

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(limit, skip, selectedTag)
    } else {
      fetchPosts(limit, skip)
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const { result, data: tags } = await getTags()
      if (result && tags) {
        setTags(tags)
      }
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }

  const handleSearchPost = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchPosts(limit, skip, searchQuery)
    }
  }

  const handleChangeTag = (value: string) => {
    setSelectedTag(value)
    fetchPostsByTag(limit, skip, value)
    updateURL()
  }

  // 사용자 모달 열기
  const openUserModal = async (user: Author) => {
    try {
      const { result, data: userData } = await getUser(user.id)
      if (result && userData) {
        setSelectedUser(userData)
        setShowUserModal(true)
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  const postTableProps = {
    searchQuery,
    selectedTag,
    setSelectedTag,
    updateURL,
    openUserModal,
    openPostDetail,
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
