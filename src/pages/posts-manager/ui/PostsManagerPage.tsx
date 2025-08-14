import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { usePostsBrowseParams, usePostsList, PostsFilterBar } from "@features/post/view-posts"
import type { Post } from "@entities/post/model"
import type { User } from "@entities/user/model"
import { useUserProfileDialog } from "@features/user/view-profile"
import { PostsTable } from "@widgets/posts-table/ui"
import { useAddPost } from "@features/post/add-post"
import { useEditPost } from "@features/post/edit-post"
import { useDeletePost } from "@features/post/delete-post"
import { usePostDetailDialog } from "@widgets/post-detail"
import { PostsPagination } from "@widgets/posts-pagination"

const PostsManager = () => {
  const { params, setParams, stepPrev, stepNext } = usePostsBrowseParams()
  const { skip, limit, searchQuery, tag: selectedTag } = params

  const { openProfile, overlay: profileOverlay } = useUserProfileDialog()

  const { posts, total, isLoading, tags } = usePostsList()

  const { deletePost } = useDeletePost()

  const { openDetail, overlay: detailOverlay } = usePostDetailDialog()

  const openPostDetail = (post: Post) => {
    openDetail(post, searchQuery)
  }

  const openUserModal = (user: User) => {
    openProfile(user.id)
  }

  const { addPost, overlay: addPostOverlay } = useAddPost()
  const { editPost, overlay: editPostOverlay } = useEditPost()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={addPost}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostsFilterBar tags={tags} params={params} onChange={setParams} />

          <PostsTable
            posts={posts}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onTagClick={(tag) => setParams({ tag })}
            onOpenUser={(user) => user && openUserModal(user)}
            onOpenDetail={openPostDetail}
            onEdit={(post) => {
              editPost(post)
            }}
            onDelete={deletePost}
            isLoading={isLoading}
          />

          <PostsPagination
            limit={limit}
            skip={skip}
            total={total}
            onLimitChange={(newLimit) => setParams({ limit: newLimit })}
            onPrev={stepPrev}
            onNext={stepNext}
          />
        </div>
      </CardContent>

      {profileOverlay}
      {addPostOverlay}
      {editPostOverlay}
      {detailOverlay}
    </Card>
  )
}

export default PostsManager
