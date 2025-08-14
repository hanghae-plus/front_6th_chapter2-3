import { useEffect, useState } from "react"

import { useLocation, useNavigate } from "react-router-dom"
import { SearchPostInput } from "@/widgets/search-post/SearchPostInput"
import { TagSelectBox, SortSelectBox } from "@/widgets/select-box"
import { PaginationControl } from "@/widgets/pagination/ui"
import { PostTable } from "@/widgets/post-table"
import { AddPostDialog, AddPostDialogOpenButton } from "@/features/post/create-post/ui"
import { EditPostDialog } from "@/features/post/update-post/ui"
import { DetailPostDialog } from "@/features/post/read-post/ui"
import { usePosts } from "@/features/post/read-post/model"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"

/**
 * 게시물 관리자 컴포넌트
 * 게시물의 CRUD 작업, 댓글 관리 등을 담당
 */
const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // ===== 상태 관리 =====
  // 게시물 관련 상태

  // 검색 및 필터링 상태
  const [searchQuery, setSearchQuery] = useState(queryParams.get("search") || "") // 검색어
  const [sortBy, setSortBy] = useState(queryParams.get("sortBy") || "") // 정렬 기준
  const [sortOrder, setSortOrder] = useState(queryParams.get("sortOrder") || "asc") // 정렬 순서
  const [selectedTag, setSelectedTag] = useState(queryParams.get("tag") || "") // 선택된 태그

  // 선택된 항목 상태
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null) // 선택된 게시물 ID

  // 데이터 상태

  // 게시물 목록 조회 (with author) - 태그별 필터링
  const postsQuery = usePosts()

  const posts = postsQuery.posts || []

  const updateURL = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("search", searchQuery)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)
    if (selectedTag) params.set("tag", selectedTag)
    navigate(`?${params.toString()}`)
  }

  const openPostDetail = (postId: number) => {
    setSelectedPostId(postId)
  }

  // URL 쿼리 파라미터 변경 시 상태 동기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostDialogOpenButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchPostInput />
            </div>
            <TagSelectBox />
            <SortSelectBox />
          </div>

          <PostTable
            searchQuery={searchQuery}
            selectedTag={selectedTag}
            onTagSelect={(tag) => {
              setSelectedTag(tag)
              updateURL()
            }}
            onPostSelect={openPostDetail}
          />

          <PaginationControl />
        </div>
      </CardContent>

      <AddPostDialog />
      <EditPostDialog postId={selectedPostId} />
      <DetailPostDialog postId={selectedPostId} />
    </Card>
  )
}

export default PostsManager
