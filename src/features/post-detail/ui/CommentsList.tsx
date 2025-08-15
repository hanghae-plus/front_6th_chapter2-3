import { CommentsListProps } from "../model/types"
import { CommentItem } from "./CommentItem"

export const CommentsList = ({
  comments,
  searchQuery,
}: CommentsListProps) => {
  return (
    <div className="space-y-1">
      {Array.isArray(comments) && comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  )
}
