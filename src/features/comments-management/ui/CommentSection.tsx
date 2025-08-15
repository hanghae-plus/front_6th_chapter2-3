import { useSetAtom } from "jotai"
import { Button } from "../../../shared/ui"
import { Plus } from "lucide-react"
import CommentItem from "./CommentItem"
import { Comment } from "../../../entities/comments/api"
import {
  editingCommentAtom,
  isEditCommentModalOpenAtom,
} from "../../edit-comment/model/atoms"

type Props = {
  postId: number
  comments: Comment[]
  searchQuery: string
  onAddComment: (postId: number) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export function CommentsSection({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onDeleteComment,
  onLikeComment,
}: Props) {
  const setEditingComment = useSetAtom(editingCommentAtom)
  const setIsEditCommentModalOpen = useSetAtom(isEditCommentModalOpenAtom)

  const handleEditComment = (comment: Comment) => {
    setEditingComment(comment)
    setIsEditCommentModalOpen(true)
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onAddComment(postId)}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments?.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            searchQuery={searchQuery}
            onClickLike={(id, postId) => onLikeComment(id, postId)}
            onClickEdit={handleEditComment}
            onClickDelete={(id, postId) => onDeleteComment(id, postId)}
          />
        ))}
      </div>
    </div>
  )
}
