import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Textarea,
  Button,
} from '@/shared/ui'
import { selectedCommentType } from '@/entities/comment/model/types'

interface UpdateCommentDialogProps {
  showEditCommentDialog: boolean
  onOpenChange: (open: boolean) => void
  selectedComment: selectedCommentType | null
  setSelectedComment: React.Dispatch<
    React.SetStateAction<selectedCommentType | null>
  >
  updateComment: (selectedComment: selectedCommentType) => void
}

export const UpdateCommentDialog = ({
  showEditCommentDialog,
  onOpenChange,
  selectedComment,
  setSelectedComment,
  updateComment,
}: UpdateCommentDialogProps) => (
  <Dialog open={showEditCommentDialog} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>댓글 수정</DialogTitle>
      </DialogHeader>
      <div className='space-y-4'>
        <Textarea
          placeholder='댓글 내용'
          value={selectedComment?.body || ''}
          onChange={(e) =>
            selectedComment &&
            setSelectedComment({ ...selectedComment, body: e.target.value })
          }
        />
        <Button
          onClick={() => {
            if (selectedComment) updateComment(selectedComment)
          }}
        >
          댓글 업데이트
        </Button>
      </div>
    </DialogContent>
  </Dialog>
)
