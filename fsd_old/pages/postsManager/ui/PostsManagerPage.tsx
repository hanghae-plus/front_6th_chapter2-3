import { AddPostButton, Pagination } from "@features/post"
import { Card, CardContent, CardHeader, CardTitle } from "@shared/ui/card"
import { PostDetailModal } from "@widgets/postDetailModal"
import { PostsFilter } from "@widgets/postsFilter"
import { PostsTable } from "@widgets/postsTable"
import { UserModal } from "@widgets/userModal"

export const PostsManagerPage = () => {
  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostsFilter />
          <PostsTable />
          <Pagination />
        </div>
      </CardContent>
      <PostDetailModal />
      <UserModal />
    </Card>
  )
}
