import { useState } from "react"

import { SearchPostInput } from "@/widgets/search-post/SearchPostInput"
import { TagSelectBox, SortSelectBox, SortOrderSelectBox } from "@/widgets/select-box"
import { PaginationControl } from "@/widgets/pagination/ui"
import { PostTable } from "@/widgets/post-table/ui"
import { AddPostDialog, AddPostDialogOpenButton } from "@/features/post/create-post/ui"
import { EditPostDialog } from "@/features/post/update-post/ui"
import { DetailPostDialog } from "@/features/post/read-post/ui"
import { UserProfileDialog } from "@/features/user/view-user-info/ui"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"

const PostsManager = () => {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  const openPostDetail = (postId: number) => {
    setSelectedPostId(postId)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <AddPostDialogOpenButton />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <SearchPostInput />
            </div>
            <TagSelectBox />
            <SortSelectBox />
            <SortOrderSelectBox />
          </div>
          <PostTable onPostSelect={openPostDetail} />
          <PaginationControl />
        </div>
      </CardContent>
      <AddPostDialog />
      <EditPostDialog postId={selectedPostId} />
      <DetailPostDialog postId={selectedPostId} />
      <UserProfileDialog />
    </Card>
  )
}

export default PostsManager
