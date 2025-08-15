import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { selectedCommentAtom, showEditCommentDialogAtom, commentsAtom } from "../../../app/store"

export const EditCommentModal = () => {
  const [showEditCommentDialog, setShowEditCommentDialog] = useAtom(showEditCommentDialogAtom)
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom)
  const [, setComments] = useAtom(commentsAtom)

  const handleUpdateComment = async () => {
    if (!selectedComment) return
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      
      // 수정된 댓글에 user 정보 추가 (기존 user 정보 유지)
      const commentWithUser = {
        ...data,
        user: selectedComment.user
      }
      
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? commentWithUser : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : null)}
          />
          <Button onClick={handleUpdateComment}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
