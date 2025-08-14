import { Card, CardContent } from "@shared/ui"
import { PostTable, PostFilters, PostDetailDialog, UserDialog, PostManagerHeader } from "@widgets"
import { AddCommentFormDialog } from "@features/add-comment"
import { EditCommentFormDialog } from "@features/edit-comment"
import { AddPostFormDialog } from "@features/add-post"
import { EditPostFormDialog } from "@features/edit-post"

export const PostsManagerPage = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <PostManagerHeader />
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
