import { Plus } from "lucide-react"
import { Button } from "@shared/ui"
import type { CommentItem as CommentType } from "@entities/comment/model"
import { CommentItem } from "@entities/comment/ui"
import { useCommentListActions } from "../model/useCommentListStore"
import { highlightText } from "@shared/lib"
import { useMemo } from "react"
import type { ReactElement } from "react"

interface CommentListProps {
  comments: CommentType[]
  searchQuery: string
}

type HighlightedComment = CommentType & {
  highlightedBody: ReactElement | null
}

export const CommentList = ({ comments, searchQuery }: CommentListProps) => {
  const { onAddComment, onEditComment, onDeleteComment, onLikeComment } = useCommentListActions()

  const highlightedComments = useMemo<HighlightedComment[]>(
    () =>
      comments.map((comment) => ({
        ...comment,
        highlightedBody: highlightText(comment.body, searchQuery),
      })),
    [comments, searchQuery],
  )

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={onAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {highlightedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={onEditComment}
            onDelete={onDeleteComment}
            onLike={onLikeComment}
          />
        ))}
      </div>
    </div>
  )
}
