import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "./../../../widgets"

// 게시물 테이블 렌더링
export const CommentAddDialog = (props) => {
  const { showAddCommentDialog, setShowAddCommentDialog, newComment, setNewComment, addComment } = props

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={addComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
