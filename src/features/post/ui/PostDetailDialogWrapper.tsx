import React from "react"
import { useAtom } from "jotai"
import { selectedPostAtom, showPostDetailDialogAtom } from "../model/PostDetailContext"
import { useComments } from "../../comment"
import { PostDetailDialog } from "../../../widgets"
import { CommentsSection } from "../../../widgets/comment/ui/CommentsSection"
import { Comment } from "../../../types"

export const PostDetailDialogWrapper: React.FC = () => {
  const [selectedPost] = useAtom(selectedPostAtom)
  const [showPostDetailDialog, setShowPostDetailDialog] = useAtom(showPostDetailDialogAtom)

  // selectedPost가 있을 때만 useComments 훅 사용
  const { addComment, updateComment, deleteComment, likeComment, comments } = useComments(selectedPost?.id)

  // 댓글 추가 다이얼로그 열기
  const handleOpenAddComment = (postId: number) => {
    // 댓글 추가 로직은 useComments 훅에서 처리
    addComment({ postId: postId, body: "", userId: 1 })
  }

  // 댓글 수정 다이얼로그 열기
  const handleOpenEditComment = (comment: Comment) => {
    // 댓글 수정 로직은 useComments 훅에서 처리
    updateComment(comment.id, comment.body)
  }

  // 댓글 삭제 처리
  const handleDeleteComment = (id: number, postId: number) => {
    deleteComment(id, postId)
  }

  // 댓글 좋아요 처리
  const handleLikeComment = (id: number) => {
    likeComment(id)
  }

  return (
    <PostDetailDialog
      open={showPostDetailDialog}
      onOpenChange={setShowPostDetailDialog}
      selectedPost={selectedPost}
      searchQuery=""
    >
      {selectedPost && (
        <CommentsSection
          postId={selectedPost.id}
          comments={comments}
          searchQuery=""
          onAddComment={handleOpenAddComment}
          onEditComment={handleOpenEditComment}
          onDeleteComment={handleDeleteComment}
          onLikeComment={handleLikeComment}
        />
      )}
    </PostDetailDialog>
  )
}
