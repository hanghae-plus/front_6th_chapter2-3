import { useEffect } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components"
import { PostTable } from "../entities/post/ui/PostTable"
import { SearchBar } from "../entities/post/ui/SearchBar"
import { TagFilter } from "../entities/tag/ui/TagFilter"
import { SortFilter } from "../features/filterPosts/ui/SortFilter"
import { Pagination } from "../shared/ui/Pagination"
import { AddPostDialog } from "../entities/post/ui/AddPostDialog"
import { EditPostDialog } from "../entities/post/ui/EditPostDialog"
import { PostDetailDialog } from "../entities/post/ui/PostDetailDialog"
import { AddCommentDialog } from "../entities/comment/ui/AddCommentDialog"
import { EditCommentDialog } from "../entities/comment/ui/EditCommentDialog"
import { UserModal } from "../entities/user/ui/UserModal"
import { usePostsManager } from "../features/postManagement/model/usePostsManager"
import { usePostStore } from "../entities/post/model/store"

const PostsManagerPage = () => {
  const { loading } = usePostStore()
  const {
    showAddDialog,
    setShowAddDialog,
    skip,
    limit,
    total,
    fetchPosts,
    handlePreviousPage,
    handleNextPage,
    setLimit,
  } = usePostsManager()

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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
          <div className="flex gap-4">
            <SearchBar />
            <TagFilter />
            <SortFilter />
          </div>

          {/* 게시물 테이블 */}
          {loading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostTable />}

          {/* 페이지네이션 */}
          <Pagination
            skip={skip}
            limit={limit}
            total={total}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            onLimitChange={setLimit}
          />
        </div>
      </CardContent>

      {/* 다이얼로그들 */}
      <AddPostDialog />
      <EditPostDialog />
      <PostDetailDialog />
      <AddCommentDialog />
      <EditCommentDialog />
      <UserModal />
    </Card>
  )
}

export default PostsManagerPage
