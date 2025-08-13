import { useState } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui"
import { usePostQueryParams } from "@shared/hooks/use-post-query-params"
import type { Post } from "@entities/post"
import type { Comment, NewComment } from "@entities/comment"
import { PostTable, PostFilters, PostDetailDialog, UserDialog, PostFormDialog, CommentFormDialog } from "@widgets"

const PostsManager = () => {
  // URL 파라미터 – 단일 출처
  const { param, updateUrl } = usePostQueryParams()

  const [searchQuery, setSearchQuery] = useState<string>("")

  // UI 전용 상태
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newComment, setNewComment] = useState<NewComment>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userIdForDialog, setUserIdForDialog] = useState<number | null>(null)

  // updateURL 은 usePostQueryParams 훅에서 가져온 update 함수를 그대로 사용합니다.

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기 (React Query 사용)
  const openUserModal = (userId: number) => {
    setUserIdForDialog(userId)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <PostFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedTag={param.tag}
            onTagChange={(value) => updateUrl({ tag: value, skip: 0 })}
            sortBy={param.sortBy}
            onSortByChange={(value) => updateUrl({ sortBy: value, skip: 0 })}
            sortOrder={param.sortOrder}
            onSortOrderChange={(value) => updateUrl({ sortOrder: value as "asc" | "desc", skip: 0 })}
          />

          <PostTable
            searchQuery={searchQuery}
            onTagSelect={(tag) => updateUrl({ tag, skip: 0 })}
            onOpenDetail={openPostDetail}
            onOpenUser={openUserModal}
            onEdit={(post) => {
              setSelectedPost(post)
              setShowEditDialog(true)
            }}
            onPrev={() => updateUrl({ skip: Math.max(0, param.skip - param.limit) })}
            onNext={() => updateUrl({ skip: param.skip + param.limit })}
            onLimitChange={(value) => updateUrl({ limit: value, skip: 0 })}
          />
        </div>
      </CardContent>

      <PostFormDialog open={showAddDialog} onOpenChange={setShowAddDialog} mode="create" />

      <PostFormDialog open={showEditDialog} onOpenChange={setShowEditDialog} mode="edit" initialPost={selectedPost} />

      <CommentFormDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        mode="create"
        postId={newComment.postId ?? undefined}
        onSuccess={() => setNewComment({ body: "", postId: null, userId: 1 })}
      />

      <CommentFormDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        mode="edit"
        initialComment={selectedComment}
      />

      {/* 게시물 상세 보기 다이얼로그 위젯 */}
      <PostDetailDialog
        open={showPostDetailDialog}
        onOpenChange={setShowPostDetailDialog}
        post={selectedPost}
        searchQuery={searchQuery}
        onOpenAddComment={(postId) => {
          setNewComment((prev) => ({ ...prev, postId }))
          setShowAddCommentDialog(true)
        }}
        onOpenEditComment={(comment) => {
          setSelectedComment(comment)
          setShowEditCommentDialog(true)
        }}
      />

      {/* 사용자 다이얼로그 */}
      <UserDialog open={showUserModal} onOpenChange={setShowUserModal} userId={userIdForDialog} />
    </Card>
  )
}

export default PostsManager
