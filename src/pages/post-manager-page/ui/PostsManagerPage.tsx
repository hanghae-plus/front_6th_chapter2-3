import { AddPostButton } from "@/feature/add-post"
import { PostsFilter } from "@/feature/posts-filter"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { Pagination, PostsTable } from "@/widgets/posts-with-users"

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
    </Card>
  )
}
