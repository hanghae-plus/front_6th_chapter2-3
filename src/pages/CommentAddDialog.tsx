import { Dialog, DialogContent, DialogHeader, DialogTitle, Textarea, Button } from "../components"
import { useApp } from "../hooks/useApp"
import { useComments } from "../hooks/useComments"

export function CommentAddDialog() {
  const { showAddCommentDialog, setShowAddCommentDialog, newComment, setNewComment } = useApp()
  const { setComments } = useComments()

  // 댓글 추가
  async function handleCommentAdd() {
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  function handleChangeCommentBody(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setNewComment({ ...newComment, body: e.target.value })
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={newComment.body} onChange={handleChangeCommentBody} />
          <Button onClick={handleCommentAdd}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
