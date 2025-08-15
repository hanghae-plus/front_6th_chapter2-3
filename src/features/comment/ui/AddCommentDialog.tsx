import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Button,
} from '@/shared/ui'
import { NewComment } from '@/entities/comment/model/types'

interface AddCommentDialogProps {
  showAddCommentDialog: boolean
  onOpenChange: (open: boolean) => void
  newComment: NewComment
  setNewComment: React.Dispatch<React.SetStateAction<NewComment>>
  addComment: () => void
}

export const AddCommentDialog = ({
  showAddCommentDialog,
  onOpenChange,
  newComment,
  setNewComment,
  addComment,
}: AddCommentDialogProps) => (
  <Dialog open={showAddCommentDialog} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>새 댓글 추가</DialogTitle>
      </DialogHeader>
      <div className='space-y-4'>
        <Textarea
          placeholder='댓글 내용'
          value={newComment.body}
          onChange={(e) =>
            setNewComment({ ...newComment, body: e.target.value })
          }
        />
        <Button onClick={addComment}>댓글 추가</Button>
      </div>
    </DialogContent>
  </Dialog>
)
