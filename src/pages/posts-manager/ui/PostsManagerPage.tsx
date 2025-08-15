import { Plus } from "lucide-react"
import { useEffect } from "react"
import { useShallow } from "zustand/shallow"

import { useDeletePostMutation } from "@/features/delete-post/api"
import { usePostsByTagQuery, usePostsQuery, usePostsSearchQuery } from "@/features/get-post/api"
import { usePostParamsStore } from "@/features/get-post/model"
import { useUsersQuery } from "@/features/get-user/api"
import { DialogType, useDialogStore } from "@/shared/lib"
import { Button } from "@/shared/ui/Button"
import { Card } from "@/shared/ui/Card"
import { CommentAddDialog, CommentUpdateDialog } from "@/widgets/comment-dialog/ui"
import { PostAddDialog, PostDetailDialog, PostUpdateDialog } from "@/widgets/post-dialog/ui"
import { PostsContent } from "@/widgets/posts-content/ui"
import { UserInfoDialog } from "@/widgets/user-dialog/ui"

export function PostsManagerPage() {
  const { openDialog } = useDialogStore((state) => state.actions)
  const { actions, limit, search, skip, tag } = usePostParamsStore(useShallow((state) => state))
  const { initializeFromURL } = actions

  const { data: postsData, isLoading: isPostsLoading } = usePostsQuery({ limit, skip })
  const { data: searchData, isLoading: isSearchLoading } = usePostsSearchQuery({ query: search })
  const { data: tagData, isLoading: isTagLoading } = usePostsByTagQuery({ tag })
  const { data: usersData, isLoading: isUsersLoading } = useUsersQuery()

  const activeData = search?.trim()
    ? { data: searchData, loading: isSearchLoading }
    : tag && tag !== "all"
      ? { data: tagData, loading: isTagLoading }
      : { data: postsData, loading: isPostsLoading }

  const posts =
    activeData.data && usersData
      ? activeData.data.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))
      : []

  const total = activeData.data?.total || 0
  const loading = activeData.loading || isUsersLoading

  const deletePostMutation = useDeletePostMutation()

  const deletePost = async (id: number) => {
    try {
      await deletePostMutation.mutateAsync({ id })
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

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
            <Button onClick={() => openDialog(DialogType.ADD_POST)}>
              <Plus className="mr-2 h-4 w-4" />
              게시물 추가
            </Button>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <PostsContent posts={posts} total={total} loading={loading} deletePost={deletePost} />
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
