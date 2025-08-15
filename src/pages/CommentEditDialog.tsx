import {Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea} from "../components"
import {useApp} from "../hooks/useApp"
import {useComments} from "../hooks/useComments.tsx"

export function CommentEditDialog() {
  const { selectedComment, setSelectedComment, showEditCommentDialog, setShowEditCommentDialog } = useApp()
  const { setComments } = useComments()

  // 댓글 업데이트
  async function handleCommentUpdate() {
    try {
      const response = await fetch(`/api/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: selectedComment.body }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  function handleChangeCommentBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSelectedComment({ ...selectedComment, body: e.target.value })
  }

  return (
    <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={selectedComment?.body || ""} onChange={handleChangeCommentBody} />
          <Button onClick={handleCommentUpdate}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
