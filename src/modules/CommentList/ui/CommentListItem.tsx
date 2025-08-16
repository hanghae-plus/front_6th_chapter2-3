import { CommentButtonDelete } from "@/features/comment/ui/CommentButtonDelete.tsx"
import { CommentButtonLike } from "@/features/comment/ui/CommentButtonLike.tsx"
import { CommentButtonShowEditDialog } from "@/features/comment/ui/CommentButtonShowEditDialog.tsx"

import { highlightText } from "@/shared/lib/highlightText"
import { type Comment } from "@/entities/Comment"
import { usePostRouteParams } from "@/features/posts/model/usePostRouteParams.ts"
import { Key } from "react"

export function CommentListItem({ comment }: { key: Key; comment: Comment }) {
  const { searchQuery } = usePostRouteParams()

  return (
    <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
      </div>

      <div className="flex items-center space-x-1">
        <CommentButtonLike comment={comment} />
        <CommentButtonShowEditDialog comment={comment} />
        <CommentButtonDelete comment={comment} />
      </div>
    </div>
  )
}
