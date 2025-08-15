import { useAtom } from "jotai"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../shared/ui"
import { newCommentAtom, showAddCommentDialogAtom, commentsAtom } from "../../../app/store"
import { userApi } from "../../../entities/user/api/user-api"

export const AddCommentModal = () => {
  const [showAddCommentDialog, setShowAddCommentDialog] = useAtom(showAddCommentDialogAtom)
  const [newComment, setNewComment] = useAtom(newCommentAtom)
  const [, setComments] = useAtom(commentsAtom)

  const handleAddComment = async () => {
    if (!newComment.postId) return
    try {
      const response = await fetch("/api/comments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      })
      const data = await response.json()
      
      // 새로 추가된 댓글에 user 정보 추가
      const userResponse = await userApi.getUser(newComment.userId)
      const commentWithUser = {
        ...data,
        user: userResponse
      }
      
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), commentWithUser],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: null, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
