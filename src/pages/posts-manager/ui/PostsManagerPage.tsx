import { useEffect } from "react"
import { useShallow } from "zustand/shallow"

import { Card } from "@/base/ui/Card"
import { AddPostButton } from "@/features/create-post/ui"
import { usePostParamsStore } from "@/features/get-post/model"
import { CommentAddDialog, CommentUpdateDialog } from "@/modules/comment-dialog/ui"
import { PostAddDialog, PostDetailDialog, PostUpdateDialog } from "@/modules/post-dialog/ui"
import { PostsContent } from "@/modules/posts-content/ui"
import { UserInfoDialog } from "@/modules/user-dialog/ui"

export function PostsManagerPage() {
  const { actions } = usePostParamsStore(useShallow((state) => state))
  const { initializeFromURL } = actions

  useEffect(() => {
    initializeFromURL()
  }, [initializeFromURL])

  return (
    <>
      {/* contents */}
      <Card className="mx-auto w-full max-w-6xl">
        <Card.Header>
          <Card.Title className="flex items-center justify-between">
            <span>게시물 관리자</span>
            <AddPostButton />
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <PostsContent />
        </Card.Content>
      </Card>

      {/* dialogs */}
      <CommentAddDialog />
      <CommentUpdateDialog />
      <PostAddDialog />
      <PostDetailDialog />
      <PostUpdateDialog />
      <UserInfoDialog />
    </>
  )
}
