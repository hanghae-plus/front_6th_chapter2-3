import { usePostsManager } from "../../features.tsx/postsManager/hooks"
import { Search, Plus } from "lucide-react"
import { Input } from "../../shared/ui/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../shared/ui/Select"
import { Button } from "../../shared/ui/Button"
import PostTable from "../../entities/post/ui/PostTable"
import Pagination from "../../shared/ui/Pagenation"
import AddPostDialog from "../../entities/post/ui/AddPostDialog"
import EditPostDialog from "../../entities/post/ui/EditPostDialog"
import PostDetailDialog from "../../entities/post/ui/PostDetailDialog"
import AddCommentDialog from "../../entities/comment/ui/AddCommentDialog"
import EditCommentDialog from "../../entities/comment/ui/EditCommentDialog"
import UserModal from "../../entities/user/ui/UserModal"

// 게시물 관리 위젯 - 순수한 UI 조합만 담당
export const PostsManagerWidget = () => {
  const {
    // 데이터
    posts,
    total,
    loading,
    limit,
    skip,
    selectedPost,
    selectedUser,
    tags,
    selectedTag,

    // UI 상태
    ui,

    // 액션
    setLimit,
    setSelectedPost,

    // 이벤트 핸들러
    handlePageChange,
    handleTagClick,
    handlePostDetail,
    handleSearch,
    handleAddPost,
    handleUpdatePost,
    handleDeletePost,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handleUserClick,

    // 계산된 값
    currentPage,
    totalPages,
  } = usePostsManager()

  if (loading) {
    return <div className="flex justify-center p-4">로딩 중...</div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-6 border-b">
        <h1 className="text-2xl font-bold">게시물 관리자</h1>
        <Button onClick={ui.openAddPostDialog} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          게시물 추가
        </Button>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={ui.searchQuery}
                  onChange={(e) => ui.setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>
            <Select value={selectedTag} onValueChange={handleTagClick}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="태그 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 태그</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.url} value={tag.slug}>
                    {tag.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ui.sortBy} onValueChange={ui.setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ui.sortOrder} onValueChange={ui.setSortOrder}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PostTable
            posts={posts}
            searchQuery={ui.searchQuery}
            selectedTag={selectedTag}
            onTagClick={handleTagClick}
            onUserClick={handleUserClick}
            onPostDetail={handlePostDetail}
            onEditPost={(post) => {
              // selectedPost 설정 후 다이얼로그 열기
              setSelectedPost(post)
              ui.openEditPostDialog()
            }}
            onDeletePost={handleDeletePost}
          />
        </div>
      </div>

      <div className="p-6 border-t">
        <Pagination
          skip={skip}
          limit={limit}
          total={total}
          onPreviousPage={() => handlePageChange(currentPage - 1)}
          onNextPage={() => handlePageChange(currentPage + 1)}
          onLimitChange={setLimit}
        />
      </div>

      {/* 엔티티 UI 컴포넌트 직접 사용 */}
      <AddPostDialog
        open={ui.showAddPostDialog}
        onOpenChange={ui.setShowAddPostDialog}
        onAdd={handleAddPost}
        newPost={ui.newPost}
        setNewPost={ui.setNewPost}
      />

      <EditPostDialog
        open={ui.showEditPostDialog}
        onOpenChange={ui.setShowEditPostDialog}
        onUpdate={handleUpdatePost}
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
      />

      <PostDetailDialog
        open={ui.showPostDetailDialog}
        onOpenChange={ui.setShowPostDetailDialog}
        selectedPost={selectedPost}
        searchQuery={ui.searchQuery}
        onAddComment={ui.openAddCommentDialog}
        onEditComment={ui.openEditCommentDialog}
        onDeleteComment={handleDeleteComment}
        onLikeComment={handleLikeComment}
      />

      <UserModal open={ui.showUserModal} onOpenChange={ui.setShowUserModal} user={selectedUser} />

      <AddCommentDialog
        open={ui.showAddCommentDialog}
        onOpenChange={ui.setShowAddCommentDialog}
        onAdd={handleAddComment}
        newComment={ui.newComment}
        setNewComment={ui.setNewComment}
      />

      <EditCommentDialog
        open={ui.showEditCommentDialog}
        onOpenChange={ui.setShowEditCommentDialog}
        onUpdate={handleUpdateComment}
        selectedComment={ui.selectedComment}
        setSelectedComment={ui.setSelectedComment}
      />
    </div>
  )
}
