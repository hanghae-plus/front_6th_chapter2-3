import { useState } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { usePostQueryParams } from "@shared/hooks/use-post-query-params"
import type { Post } from "@entities/post"
import { PostTable, PostFilters, PostDetailDialog, UserDialog } from "@widgets"
import { AddCommentFormDialog } from "@features/add-comment"
import { EditCommentFormDialog } from "@features/edit-comment"
import { AddPostFormDialog } from "@features/add-post"
import { EditPostFormDialog } from "@features/edit-post"
import { useDialogStore } from "@/app/store/dialog-store"

export const PostsManagerPage = () => {
  // URL 파라미터 – 단일 출처
  const { param, updateUrl } = usePostQueryParams()

  const [searchQuery, setSearchQuery] = useState<string>("")

  // UI 전용 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const openAddDialog = useDialogStore((s) => s.openAddPost)
  const openEditDialog = useDialogStore((s) => s.openEditPost)

  const openAddCommentDialog = useDialogStore((s) => s.openAddComment)
  const openEditCommentDialog = useDialogStore((s) => s.openEditComment)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userIdForDialog, setUserIdForDialog] = useState<number | null>(null)

  // updateURL 은 usePostQueryParams 훅에서 가져온 update 함수를 그대로 사용합니다.

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기 (React Query 사용)
  const openUserModal = (userId: number) => {
    setUserIdForDialog(userId)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={param.tag}
            onTagChange={(value) => updateUrl({ tag: value, skip: 0 })}
            sortBy={param.sortBy}
            onSortByChange={(value) => updateUrl({ sortBy: value, skip: 0 })}
            sortOrder={param.sortOrder}
            onSortOrderChange={(value) => updateUrl({ sortOrder: value as "asc" | "desc", skip: 0 })}
          />

          <PostTable
            searchQuery={searchQuery}
            onTagSelect={(tag) => updateUrl({ tag, skip: 0 })}
            onOpenDetail={openPostDetail}
            onOpenUser={openUserModal}
            onEdit={(post) => {
              setSelectedPost(post)
              openEditDialog(post)
            }}
            onPrev={() => updateUrl({ skip: Math.max(0, param.skip - param.limit) })}
            onNext={() => updateUrl({ skip: param.skip + param.limit })}
            onLimitChange={(value) => updateUrl({ limit: value, skip: 0 })}
          />
        </div>
      </CardContent>

      <AddPostFormDialog />
      <EditPostFormDialog />

      {/* 댓글 작성 / 수정 다이얼로그 */}
      <AddCommentFormDialog />
      <EditCommentFormDialog />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
        onOpenAddComment={openAddCommentDialog}
        onOpenEditComment={openEditCommentDialog}
      />

      {/* 사용자 다이얼로그 */}
      <UserDialog open={showUserModal} onOpenChange={setShowUserModal} userId={userIdForDialog} />
    </Card>
  )
}
