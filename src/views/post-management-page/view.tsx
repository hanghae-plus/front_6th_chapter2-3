import { postEntityQueries, postSchema } from "@/entities/posts"
import { userSchema } from "@/entities/users"
import { openAddCommentDialog } from "@/features/add-comment/ui"
import { openAddPostDialog } from "@/features/add-post"
import { openUpdateCommentDialog } from "@/features/update-comment"
import { openUpdatePostDialog } from "@/features/update-post/ui"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { openPostDetailDialog } from "@/widgets/post-detail-dialog"
import { PostListTable, PostListTableFilter, PostListTablePagination } from "@/widgets/post-list-table"
import { Post } from "@/widgets/types"
import { openUserInfoDialog } from "@/widgets/user-info-dialog"
import { useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import z from "zod"
import { usePostManagementViewPresenter } from "./presenter"

const PostManagementView = () => {
  const queryClient = useQueryClient()
  const presenter = usePostManagementViewPresenter()

  const handleOpenPostDetailDialog = (post: z.infer<typeof postSchema>) => {
    openPostDetailDialog({
      post: post,
      comments: presenter.getCommentsByPostIdResponse?.data ?? [],
      searchQuery: presenter.pagination.searchQuery,

      onDeleteComment: (commentId) => presenter.deleteComment.mutate({ id: commentId }),
      onLikeComment: (commentId, likes) => presenter.likeComment.mutate({ id: commentId, likes }),
      onOpenAddCommentDialog: () => {
        openAddCommentDialog({
          onSubmit: (formData) => presenter.addComment.mutateAsync(formData),
        })
      },
      onOpenUpdateCommentDialog: (comment) => {
        presenter.setSelectedComment(comment)
        openUpdateCommentDialog({
          comment: { body: comment.body, postId: comment.postId, userId: comment.user.id },
          onSubmit: (formValues) => presenter.updateComment.mutate({ id: comment.id, body: formValues.body }),
        })
      },
    })
  }

  const handleOpenAuthorInformationDialog = (user: z.infer<typeof userSchema>) => {
    openUserInfoDialog({ userId: user.id })
  }

  const handleOpenAddPostDialog = () => {
    openAddPostDialog({
      onSubmit: (formData) =>
        presenter.addPost.mutate(formData, {
          onSuccess: (addPostResponse) => {
            queryClient.setQueryData(
              postEntityQueries.getPosts({ limit: presenter.pagination.limit, skip: presenter.pagination.skip })
                .queryKey,
              (prevPost) => ({ ...prevPost, posts: [addPostResponse, ...prevPost.posts] }),
            )
          },
        }),
    })
  }

  const handleOpenUpdatePostDialog = (post: Post) => {
    presenter.setSelectedPost(post)
    openUpdatePostDialog({
      post: post,
      onSubmit: (formValues) =>
        presenter.updatePost.mutate({
          id: post.id,
          title: formValues.title,
          body: formValues.body,
        }),
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
          <PostListTableFilter
            selectedTag={presenter.selectedTag}
            setSelectedTag={presenter.setSelectedTag}
            tags={presenter.tags ?? []}
          />

          <PostListTable
            selectedTag={presenter.selectedTag}
            setSelectedTag={presenter.setSelectedTag}
            handleOpenAuthorInformationDialog={handleOpenAuthorInformationDialog}
            handleOpenPostDetailDialog={handleOpenPostDetailDialog}
            handleOpenUpdatePostDialog={handleOpenUpdatePostDialog}
            limit={presenter.pagination.limit}
            skip={presenter.pagination.skip}
            searchQuery={presenter.pagination.searchQuery}
          />

          <PostListTablePagination
            total={presenter.postPagination.total ?? 0}
            limit={presenter.postPagination.limit}
            skip={presenter.postPagination.skip}
            handleLimitChange={presenter.handleLimitChange}
            handleNextPage={presenter.handleNextPage}
            handlePreviousPage={presenter.handlePreviousPage}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default PostManagementView

export const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!text) return null
  if (!highlight.trim()) {
    return <span>{text}</span>
  }
  const regex = new RegExp(`(${highlight})`, "gi")
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </span>
  )
}
