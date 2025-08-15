import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { useCommentMutations } from "@/entities/comments"
import { type Post, usePostMutations } from "@/entities/posts"
import type { User } from "@/entities/users"
import { openAddPostDialog } from "@/features/add-post"
import { openUpdatePostDialog } from "@/features/update-post/ui"
import { openPostDetailDialog } from "@/widgets/post-detail-dialog"
import { PostListTable, PostListTableFilter, PostListTablePagination, usePostListFilterQueryParams } from "@/widgets/post-list-table"
import { openUserInfoDialog } from "@/widgets/user-info-dialog"

import { Plus } from "lucide-react"
import { useState } from "react"

const PostManagementView = () => {
  const postListFilter = usePostListFilterQueryParams()
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

  const { addPost, updatePost } = usePostMutations({
    queryParams : { ... postListFilter.queryParams, slug: postListFilter.queryParams.selectedTag },
  })
  const { deleteComment, likeComment } = useCommentMutations({
    postId: selectedPostId as number,
  })

  const handleOpenPostDetailDialog = (post: Post) => {
    setSelectedPostId(post.id)
    openPostDetailDialog({
      post: post,
      searchQuery: postListFilter.queryParams.searchQuery,
      onDeleteComment: (commentId) => deleteComment.mutate({ id: commentId }),
      onLikeComment: (commentId, likes) => likeComment.mutate({ id: commentId, likes }),
      onCloseCallback: () => setSelectedPostId(null),
    })
  }

  const handleOpenAuthorInformationDialog = (user: User) => {
    openUserInfoDialog({ userId: user.id })
  }

  const handleOpenAddPostDialog = () => {
    openAddPostDialog({
      onSubmit: (formData) => addPost.mutate(formData),
    })
  }

  const handleOpenUpdatePostDialog = (post: Post) => {
    setSelectedPostId(post.id)
    openUpdatePostDialog({
      post: post,
      onSubmit: (formValues) => updatePost.mutate({ id: post.id, title: formValues.title, body: formValues.body }),
      onCloseCallback: () => setSelectedPostId(null),
    })
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={handleOpenAddPostDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostListTableFilter />

          <PostListTable
            onOpenAuthorInformationDialog={handleOpenAuthorInformationDialog}
            onOpenPostDetailDialog={handleOpenPostDetailDialog}
            onOpenUpdatePostDialog={handleOpenUpdatePostDialog}
          />

          <PostListTablePagination />
        </div>
      </CardContent>
    </Card>
  )
}

export default PostManagementView
