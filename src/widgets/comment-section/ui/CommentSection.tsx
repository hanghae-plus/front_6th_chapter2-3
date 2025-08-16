import { useState } from "react"
import { useCommentActions } from "@/features/comment/comment-actions"
import { Comment } from "@/entities/comment/model"
import { useDialogActions } from "@/shared/model"
import { CommentHeader } from "./CommentHeader"
import { CommentList } from "./CommentList"
import { CommentDialogs } from "./CommentDialogs"

interface CommentSectionProps {
  postId: number
}

export const CommentSection = ({ postId }: CommentSectionProps) => {
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const { showDialog } = useDialogActions()

  const { commentsData, addComment, updateComment, deleteComment, likeComment } = useCommentActions(postId)

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment)
    showDialog("EDIT_COMMENT")
  }

  const handleCloseEdit = () => {
    setSelectedComment(null)
  }

  return (
    <>
      <div className="mt-6">
        <CommentHeader onAddComment={() => showDialog("ADD_COMMENT")} />

        {!commentsData ? (
          <div className="text-center py-4">댓글 로딩 중...</div>
        ) : (
          <CommentList
            comments={commentsData.comments || []}
            onLike={likeComment}
            onEdit={handleEditComment}
            onDelete={deleteComment}
          />
        )}
      </div>
      <CommentDialogs
        postId={postId}
        selectedComment={selectedComment}
        onAddComment={addComment}
        onUpdateComment={updateComment}
        onCloseEdit={handleCloseEdit}
      />
    </>
  )
}
