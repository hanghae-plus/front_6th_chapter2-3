import { AddPostButton } from "@features/post/components/AddPostButton"
import { Pagination } from "@features/post/components/Pagination"
import { PostDetailModal } from "@features/post/components/PostDetailModal"
import { UserModal } from "@features/user/components/UserModal"
import { PostsFilterSection } from "@pages/PostsManagerPage/components/PostsFilterSection"
import { PostsTableSection } from "@pages/PostsManagerPage/components/PostsTableSection"
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/card"

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
          <PostsFilterSection />
          <PostsTableSection />
          <Pagination />
        </div>
      </CardContent>
      <PostDetailModal />
      <UserModal />
    </Card>
  )
}
