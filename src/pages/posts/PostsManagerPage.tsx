import { useEffect } from "react"
import { Plus } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../../shared/ui"
import { usePagination, useSearchFilter, usePostDialogs } from "../../shared/store"
import { AddCommentForm } from "../../features/comments/add-comment"
import { AddPostForm } from "../../features/posts/add-post"
import { PostDetailDialog } from "../../features/posts/post-detail"
import { Pagination } from "../../widgets"
import { PostList } from "../../features/posts/post-list"
import { EditCommentForm } from "../../features/comments/edit-comment"
import { EditPostForm } from "../../features/posts/edit-post"
import { UserInfoDialog } from "../../features/user/user-info"
import { CommentList } from "../../features/comments/comment-list/ui/CommentList"
import { SearchFilter } from "../../features/posts/search-filter"

const PostsManager = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // 전역 상태 훅 사용
  const { skip, setSkip, limit, setLimit } = usePagination()
  const { searchQuery, setSearchQuery, selectedTag, setSelectedTag, sortBy, setSortBy, sortOrder, setSortOrder } =
    useSearchFilter()
  const { setShowAddDialog } = usePostDialogs()

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

  // URL 동기화를 위한 useEffect
  useEffect(() => {
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

  // URL 파라미터 초기화
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("q") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search, setSkip, setLimit, setSearchQuery, setSortBy, setSortOrder, setSelectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilter updateURL={updateURL} />

          {/* 게시물 테이블 */}
          <PostList updateURL={updateURL} />

          {/* 페이지네이션 */}
          <Pagination />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostForm />

      {/* 게시물 수정 대화상자 */}
      <EditPostForm />

      {/* 댓글 추가 대화상자 */}
      <AddCommentForm />

      {/* 댓글 수정 대화상자 */}
      <EditCommentForm />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog children={<CommentList />} />

      {/* 사용자 모달 */}
      <UserInfoDialog />
    </Card>
  )
}

export default PostsManager
