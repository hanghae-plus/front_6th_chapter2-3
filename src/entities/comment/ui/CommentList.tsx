/* eslint-disable @typescript-eslint/no-explicit-any */

import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"

import { PostHighlightText } from "@/entities/post/ui"
import { Button } from "@/shared/ui/Button"

type CommentListProps = {
  postId: any
  comments: any
  searchQuery: string
  onAddComment: (postId: any) => void
  onEditComment: (comment: any) => void
  onDeleteComment: (commentId: any, postId: any) => void
  onLikeComment: (commentId: any, postId: any) => void
}

export function CommentList({
  postId,
  comments,
  searchQuery,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment,
}: CommentListProps) {
  return (
    <div className="mt-2">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => onAddComment(postId)}>
          <Plus className="mr-1 h-3 w-3" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments[postId]?.map((comment: any) => (
          <div key={comment.id} className="flex items-center justify-between border-b pb-1 text-sm">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="truncate font-medium">{comment.user.username}:</span>
              <span className="truncate">
                <PostHighlightText text={comment.body} highlight={searchQuery} />
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id, postId)}>
                <ThumbsUp className="h-3 w-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
