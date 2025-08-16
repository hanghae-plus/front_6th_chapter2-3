import { Card, CardContent, Table, TableBody, TableHead, TableHeader, TableRow } from "../components"
import { usePosts } from "../hooks/usePosts"
import { useQueryParams } from "../hooks/useQueryParams"
import { CommentAddDialog } from "./CommentAddDialog.tsx"
import { CommentEditDialog } from "./CommentEditDialog.tsx"
import { Pagination } from "./Pagination"
import { PostAddDialog } from "./PostAddDialog.tsx"
import { PostEditDialog } from "./PostEditDialog.tsx"
import { PostManagerHeader } from "./PostManagerHeader.tsx"
import { PostTableRow } from "./PostTableRow.tsx"
import { PostViewDialog } from "./PostViewDialog.tsx"
import { SearchAndFilter } from "./SearchAndFilter.tsx"
import { UserDialog } from "./UserDialog.tsx"
import { useEffect } from "react"

const PostsManager = () => {
  // Post 엔티티 기준으로 필요한 인자를 받고 반환하는 커스텀 훅으로 분리
  const { posts, total, loading } = usePosts()

  const {
    skip,
    setSkip,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    searchQuery,
    setSearchQuery,
    updateURL,
  } = useQueryParams()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setSkip(parseInt(params.get("skip") || "0"))
    setLimit(parseInt(params.get("limit") || "10"))
    setSearchQuery(params.get("search") || "")
    setSortBy(params.get("sortBy") || "")
    setSortOrder(params.get("sortOrder") || "asc")
    setSelectedTag(params.get("tag") || "")
  }, [location.search])

  useEffect(() => {
    updateURL()
  }, [skip, limit, searchQuery, sortBy, sortOrder, selectedTag])

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader />

      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchAndFilter />

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead className="w-[150px]">작성자</TableHead>
                  <TableHead className="w-[150px]">반응</TableHead>
                  <TableHead className="w-[150px]">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <PostTableRow key={post.id} post={post} />
                ))}
              </TableBody>
            </Table>
          )}

          {/* 페이지네이션 */}
          <Pagination limit={limit} setLimit={setLimit} skip={skip} setSkip={setSkip} total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialog />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialog />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialog />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialog />

      {/* 게시물 상세 보기 대화상자 */}
      <PostViewDialog />

      {/* 사용자 모달 */}
      <UserDialog />
    </Card>
  )
}

export default PostsManager
