import { Button, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui"
import { HighlightText } from "@/views/post-management-page/view"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { overlay } from "overlay-kit"
import { Comment, Post } from "../types"

type Props = {
  post: Post
  comments: Comment[]
  onDeleteComment: (commentId: number) => void
  onLikeComment: (commentId: number, likes: number) => void
  onOpenAddCommentDialog: () => void
  onOpenUpdateCommentDialog: (comment: Comment) => void
  searchQuery: string
}

export const PostDetailDialog = ({
  post,
  comments,
  onDeleteComment,
  onLikeComment,
  onOpenAddCommentDialog,
  onOpenUpdateCommentDialog,
  searchQuery,
}: Props) => {
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>
          <HighlightText text={post?.title ?? ""} highlight={searchQuery} />
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <p>
          <HighlightText text={post?.body ?? ""} highlight={searchQuery} />
        </p>

        <div className="mt-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">댓글</h3>
            <Button size="sm" onClick={onOpenAddCommentDialog}>
              <Plus className="w-3 h-3 mr-1" />
              댓글 추가
            </Button>
          </div>
          <div className="space-y-1">
            {comments?.map((comment) => (
              <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <span className="font-medium truncate">{comment.user.username}:</span>
                  <span className="truncate">
                    <HighlightText text={comment.body} highlight={searchQuery} />
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const targetComment = comments.find((targetComment) => targetComment.id === comment.id)
                      onLikeComment(comment.id, (targetComment?.likes ?? 0) + 1)
                    }}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="ml-1 text-xs">{comment.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onOpenUpdateCommentDialog(comment)}>
                    <Edit2 className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDeleteComment(comment.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export const openPostDetailDialog = (options: Omit<Props, "close">) => {
  overlay.open(({ isOpen, close }) => (
    <Dialog open={isOpen} onOpenChange={() => !!isOpen && close()}>
      <PostDetailDialog
        post={options.post}
        comments={options.comments}
        onDeleteComment={options.onDeleteComment}
        onLikeComment={options.onLikeComment}
        onOpenAddCommentDialog={options.onOpenAddCommentDialog}
        onOpenUpdateCommentDialog={options.onOpenUpdateCommentDialog}
        searchQuery={options.searchQuery}
      />
    </Dialog>
  ))
}
