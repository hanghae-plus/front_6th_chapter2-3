import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { PostTable, PostFilters, PostDetailDialog, UserDialog } from "@widgets"
import { AddCommentFormDialog } from "@features/add-comment"
import { EditCommentFormDialog } from "@features/edit-comment"
import { AddPostFormDialog } from "@features/add-post"
import { EditPostFormDialog } from "@features/edit-post"
import { useDialogStore } from "@/app/store/dialog-store"

export const PostsManagerPage = () => {
  // Page 레벨에서만 필요한 dialog 액션
  const openAddDialog = useDialogStore((s) => s.openAddPost)

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
          <PostFilters />
          <PostTable />
        </div>
      </CardContent>

      <AddPostFormDialog />
      <EditPostFormDialog />

      {/* 댓글 작성 / 수정 다이얼로그 */}
      <AddCommentFormDialog />
      <EditCommentFormDialog />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog />

      {/* 사용자 다이얼로그 */}
      <UserDialog />
    </Card>
  )
}
