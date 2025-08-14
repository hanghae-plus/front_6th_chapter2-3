import { Button, Dialog, Textarea } from "../../../shared/ui"
import { useCommentStore } from "../model/store"
import { Comment } from "../../../entities"
import { requestApi } from "../../../shared/lib"
import { UpsertComment } from "../type"

export const CommentEditDialog = () => {
  const {
    comments,
    setComments,
    selectedComment,
    setSelectedComment,
    showEditCommentDialog,
    setShowEditCommentDialog,
  } = useCommentStore()

  // 댓글 업데이트
  const updateComment = async () => {
    try {
      const { result, data } = await requestApi<UpsertComment>(`/api/comments/${selectedComment?.id}`, {
        method: "PUT",
        body: JSON.stringify({ body: selectedComment?.body }),
      })

      if (result && data) {
        setComments({
          ...comments,
          [data.postId]: (comments[data.postId] ?? []).map((c) => (c.id === data.id ? data : c)),
        })
        setShowEditCommentDialog(false)
      }
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  return (
    <Dialog open={showEditCommentDialog} handleChange={setShowEditCommentDialog} title="댓글 수정">
      <div className="space-y-4">
        <Textarea
          placeholder="댓글 내용"
          value={selectedComment?.body || ""}
          onChange={(e) => setSelectedComment({ ...(selectedComment as Comment), body: e.target.value })}
        />
        <Button onClick={updateComment}>댓글 업데이트</Button>
      </div>
    </Dialog>
  )
}
