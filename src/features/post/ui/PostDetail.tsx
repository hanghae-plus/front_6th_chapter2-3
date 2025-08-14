import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui"
import { highlightText } from "../../../shared/lib/text-utils.tsx"
import { Post } from "../../../entities/post/model/types.ts"
import { Comment } from "../../../entities/comment/model/types.ts"
import React from "react"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"

interface PostDetailProps {
  open: boolean
  onChangeOpen: (open: boolean) => void
  post: Post | null
  searchQuery: string
  comments?: Comment[]
  onAddComment: (postId: number) => void
  onEditComment: (comment: Comment) => void
  onDeleteComment: (commentId: number, postId: number) => void
  onLikeComment: (commentId: number, postId: number) => void
}

export const PostDetail: React.FC<PostDetailProps> = ({
  open,
  onChangeOpen,
  post,
  searchQuery,
  comments,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onLikeComment
  }) => {

  const postId = post?.id

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body, searchQuery)}</p>
          {postId &&
            <div className="mt-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">댓글</h3>
                <Button size="sm" onClick={() => onAddComment(postId)}>
                  <Plus className="w-3 h-3 mr-1" />
                  댓글 추가
                </Button>
              </div>
              <div className="space-y-1">
                {(comments ?? []).map((comment) => (
                  <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-medium truncate">{comment.user.username}:</span>
                      <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => onLikeComment(comment.id, postId)}>
                        <ThumbsUp className="w-3 h-3" />
                        <span className="ml-1 text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onEditComment(comment)}>
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id, postId)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}