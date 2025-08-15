import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../widgets/ui"
import { useComment } from "../hooks/useComment"

// 게시물 테이블 렌더링
export const CommentEditDialog = () => {
  const { selectedComment, setSelectedComment, showEditCommentDialog, setShowEditCommentDialog, updateComment } =
    useComment()

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
            onChange={(e) => setSelectedComment({ ...selectedComment, body: e.target.value })}
          />
          <Button onClick={updateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
