import { useQueryParamsPagination } from "@/shared/hooks"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui"
import { deleteComment as deleteCommentAction, likeComment as likeCommentAction } from "@/entities/comments"
import type { Post } from "@/entities/posts"
import {
  addPost as addPostAction,
  optimisticAddPost,
  postEntityQueries,
  updatePost as updatePostAction,
} from "@/entities/posts"
import type { User } from "@/entities/users"
import { openAddPostDialog } from "@/features/add-post"
import { openUpdatePostDialog } from "@/features/update-post/ui"
import { openPostDetailDialog } from "@/widgets/post-detail-dialog"
import { PostListTable, PostListTableFilter, PostListTablePagination } from "@/widgets/post-list-table"
import { openUserInfoDialog } from "@/widgets/user-info-dialog"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "lucide-react"

const PostManagementView = () => {
  const queryClient = useQueryClient()

  const [queryParamsPagination] = useQueryParamsPagination()

  const addPost = useMutation({
    mutationFn: addPostAction,
    onError: (error) => {
      console.error("게시물 추가 오류:", error)
    },
    onSuccess: (addPostResponse) => {
      queryClient.setQueryData(
        postEntityQueries.getPosts({ limit: queryParamsPagination.limit, skip: queryParamsPagination.skip }).queryKey,
        (prevPostResponse) => optimisticAddPost(prevPostResponse, addPostResponse),
      )
    },
  })

  const updatePost = useMutation({
    mutationFn: updatePostAction,
    onError: (error) => {
      console.error("게시물 업데이트 오류:", error)
    },
  })

  const deleteComment = useMutation({
    mutationFn: deleteCommentAction,
    onError: (error) => console.error("댓글 삭제 오류:", error),
  })

  const likeComment = useMutation({
    mutationFn: likeCommentAction,
    onError: (error) => console.error("댓글 좋아요 오류:", error),
  })

  const handleOpenPostDetailDialog = (post: Post) => {
    openPostDetailDialog({
      post: post,
      searchQuery: queryParamsPagination.searchQuery,

      onDeleteComment: (commentId) => deleteComment.mutate({ id: commentId }),
      onLikeComment: (commentId, likes) => likeComment.mutate({ id: commentId, likes }),
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
    openUpdatePostDialog({
      post: post,
      onSubmit: (formValues) => updatePost.mutate({ id: post.id, title: formValues.title, body: formValues.body }),
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
