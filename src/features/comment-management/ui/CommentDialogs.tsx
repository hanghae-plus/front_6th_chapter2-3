import { AddComment, UpdateComment } from "@/features/comment-management/types"
import { Button, Textarea } from "@/shared/ui"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

interface CommentDialogsProps {
  newComment: AddComment | null
  onAddComment: () => void
  onAddDialogChange: (open: boolean) => void
  onEditDialogChange: (open: boolean) => void
  onNewCommentChange: (comment: AddComment | null) => void

  onSelectedCommentChange: (comment: UpdateComment | null) => void
  onUpdateComment: () => void
  selectedComment: UpdateComment | null
  // Add Comment Dialog
  showAddDialog: boolean
  // Edit Comment Dialog
  showEditDialog: boolean
}

export function CommentDialogs({
  showAddDialog,
  onAddDialogChange,
  newComment,
  onNewCommentChange,
  onAddComment,
  showEditDialog,
  onEditDialogChange,
  selectedComment,
  onSelectedCommentChange,
  onUpdateComment,
}: CommentDialogsProps) {
  return (
    <>
      {/* 댓글 추가 대화상자 */}
      <Dialog onOpenChange={onAddDialogChange} open={showAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 댓글 추가</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e) =>
                onNewCommentChange({
                  body: e.target.value,
                  postId: newComment?.postId || 0,
                  userId: newComment?.userId || 1,
                })
              }
              placeholder="댓글 내용"
              value={newComment?.body || ""}
            />
            <Button onClick={onAddComment}>댓글 추가</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 수정 대화상자 */}
      <Dialog onOpenChange={onEditDialogChange} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              onChange={(e) =>
                onSelectedCommentChange({
                  id: selectedComment?.id || 0,
                  body: e.target.value,
                  likes: selectedComment?.likes || 0,
                  postId: selectedComment?.postId || 0,
                })
              }
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
            />
            <Button onClick={onUpdateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
