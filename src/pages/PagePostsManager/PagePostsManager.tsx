import { PostButtonOpenDialogAdd } from "@/features/post/ui/PostButtonOpenDialogAdd.tsx"
import { CommentDialogAdd } from "@/modules/CommentDialog/ui/CommentDialogAdd.tsx"
import { CommentDialogEdit } from "@/modules/CommentDialog/ui/CommentDialogEdit.tsx"
import { PostDialogAdd } from "@/modules/PostDialog/ui/PostDialogAdd.tsx"
import PostDialogDetail from "@/modules/PostDialog/ui/PostDialogDetail.tsx"
import { PostDialogEdit } from "@/modules/PostDialog/ui/PostDialogEdit.tsx"
import { PostsTable } from "@/modules/PostsTable/ui/PostsTable.tsx"
import { PostsTableHeader } from "@/modules/PostsTable/ui/PostsTableHeader.tsx"
import { PostsTablePagination } from "@/modules/PostsTable/ui/PostsTablePagination.tsx"
import { UserDialogDetail } from "@/modules/UserDialog/ui/UserDialogDetail.tsx"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"

function PostsManager() {
  return (
    <>
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>게시물 관리자</span>

            <PostButtonOpenDialogAdd />
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <PostsTableHeader />

            <PostsTable />

            <PostsTablePagination />
          </div>
        </CardContent>
      </Card>

      <PostDialogDetail />
      <PostDialogAdd />
      <PostDialogEdit />

      <CommentDialogAdd />
      <CommentDialogEdit />

      <UserDialogDetail />
    </>
  )
}

export default PostsManager
