import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../shared/ui"
import { usePosts } from "../hooks/usePosts"
import { useTags } from "../hooks/useTags"
import { usePostCreate } from "../features/post-create/model/actions"
import { usePostEdit } from "../features/post-edit/model/actions"
import { usePostDelete } from "../features/post-delete/model/actions"
import { usePostReactions } from "../features/post-reactions/model/actions"
import { useCommentManage } from "../features/comment-manage/model/actions"
import { usePostDetail } from "../features/post-detail/model/actions"
import { useUserDetail } from "../features/user-detail/model/actions"
import { PostCreateDialog } from "../features/post-create/ui/PostCreateDialog"
import { PostEditDialog } from "../features/post-edit/ui/PostEditDialog"
import { CommentDialog } from "../features/comment-manage/ui/CommentDialog"
import { PostDetailDialog } from "../features/post-detail/ui/PostDetailDialog"
import { UserDialog } from "../features/user-detail/ui/UserDialog"
import { PostFilters } from "../widgets/post-filters/PostFilters"
import { PostsTable, type PostRowVM } from "../widgets/post-list/PostsTable"
import { PaginationControls } from "../widgets/pagination/PaginationControls"

const PostsManagerPage = () => {
  const {
    posts,
    total,
    postsLoading,
    postsError,
    skip,
    limit,
    searchQuery,
    selectedTag,
    sortBy,
    sortOrder,
    setSkip,
    setLimit,
    setSearchQuery,
    setSelectedTag,
    setSortBy,
    setSortOrder,
    handleSearch,
  } = usePosts()

  // 전역 total을 동기화(번호 계산/위치 정책 등에서 사용 가능)
  // import 없이 내부로 유지 가능하지만, 확장을 위해 jotai atom으로도 보관할 수 있음

  const { data: tags = [] } = useTags()

  // Feature hooks로 상태와 로직 분리
  const postCreate = usePostCreate()
  const postEdit = usePostEdit()
  const postDelete = usePostDelete()
  const postReactions = usePostReactions()
  const commentManage = useCommentManage()
  const postDetail = usePostDetail()
  const userDetail = useUserDetail()

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={postCreate.openDialog}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            tags={tags}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {postsLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : postsError ? (
            <div className="text-red-500 text-center p-4">Error: {postsError.message}</div>
          ) : (
            <PostsTable
              rows={posts.map((p, idx): PostRowVM => ({
                clientKey: p.clientId ?? `${p.id}`,
                rowNo: sortOrder === "desc" ? total - (skip + idx) : skip + idx + 1,
                title: p.title,
                body: p.body,
                tags: p.tags ?? [],
                author: p.author,
                likes: p.reactions?.likes ?? 0,
                dislikes: p.reactions?.dislikes ?? 0,
                origin: { id: p.id, clientId: p.clientId },
              }))}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              searchQuery={searchQuery}
              onEdit={(origin) => postEdit.openEditDialog({ ...posts.find((pp) => (pp.clientId ?? `${pp.id}`) === (origin.clientId ?? `${origin.id}`))!, id: origin.id })}
              onDelete={(id, clientId) => postDelete.handleDelete({ postId: id, clientId })}
              onLike={(id, likes, clientId) => postReactions.handleLike(id, likes, clientId)}
              onDislike={(id, dislikes, clientId) => postReactions.handleDislike(id, dislikes, clientId)}
              onUserClick={(user) => {
                userDetail.openUserDetail(user)
              }}
              onPostClick={(origin) => {
                const post = posts.find((pp) => (pp.clientId ?? `${pp.id}`) === (origin.clientId ?? `${origin.id}`))
                if (post) {
                  postDetail.openPostDetail(post)
                  commentManage.openPostComments(post.id)
                }
              }}
            />
          )}

          <PaginationControls skip={skip} limit={limit} total={total} setSkip={setSkip} setLimit={setLimit} />
        </div>
      </CardContent>

      {/* Feature별 Dialog 컴포넌트들 */}
      <PostCreateDialog
        open={postCreate.showDialog}
        onOpenChange={postCreate.closeDialog}
        onSubmit={postCreate.handleSubmit}
        post={postCreate.newPostData}
        setPost={postCreate.setNewPostData}
      />

      <PostEditDialog
        open={postEdit.showDialog}
        onOpenChange={postEdit.closeDialog}
        onSubmit={postEdit.handleSubmit}
        post={postEdit.editablePost}
        setPost={postEdit.setEditablePost}
      />

      {/* 댓글 관련 Dialog 컴포넌트들 */}
      <CommentDialog
        open={commentManage.showAddDialog}
        onOpenChange={commentManage.closeAddDialog}
        onSubmit={commentManage.handleAddComment}
        commentBody={commentManage.newCommentData.body}
        setCommentBody={(body) => commentManage.setNewCommentData({ ...commentManage.newCommentData, body })}
        isEdit={false}
      />

      {commentManage.editableComment && (
        <CommentDialog
          open={commentManage.showEditDialog}
          onOpenChange={commentManage.closeEditDialog}
          onSubmit={commentManage.handleUpdateComment}
          commentBody={commentManage.editableComment.body || ""}
          setCommentBody={(body) => commentManage.setEditableComment({ ...commentManage.editableComment, body })}
          isEdit={true}
        />
      )}

      {/* 게시물 상세 보기 Dialog */}
      <PostDetailDialog
        open={postDetail.showDialog}
        onOpenChange={postDetail.closeDialog}
        post={postDetail.selectedPost}
        comments={commentManage.comments}
        searchQuery={searchQuery}
        onCommentAdd={() => {
          if (postDetail.selectedPost) {
            commentManage.openAddDialog(postDetail.selectedPost.id)
          }
        }}
        onCommentEdit={commentManage.openEditDialog}
        onCommentDelete={commentManage.handleDeleteComment}
        onCommentLike={commentManage.handleLikeComment}
      />

      {/* 사용자 상세 정보 Dialog */}
      <UserDialog open={userDetail.showDialog} onOpenChange={userDetail.closeDialog} user={userDetail.selectedUser} />
    </Card>
  )
}

export default PostsManagerPage
