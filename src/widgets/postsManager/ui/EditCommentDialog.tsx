import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../shared/ui/Dialog"
import { Button } from "../../../shared/ui/Button"
import { Textarea } from "../../../shared/ui/Textarea"
import { useCommentStore } from "../../../entities/comment/model/store"
import { useCommentManagement } from "../../../features.tsx/commentManagement/model/useCommentManagement"

export const EditCommentDialog: React.FC = () => {
  const { selectedComment, setSelectedComment } = useCommentStore()
  const { showEditCommentDialog, setShowEditCommentDialog, handleUpdateComment } = useCommentManagement()

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={selectedComment?.body || ""}
            onChange={(e) => setSelectedComment({ ...selectedComment!, body: e.target.value })}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
