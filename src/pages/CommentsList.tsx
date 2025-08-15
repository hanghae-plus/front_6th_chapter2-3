// 댓글 렌더링
import type { Post } from "../entities/Post/Post.ts"
import { useApp } from "../hooks/useApp.tsx"
import { useComments } from "../hooks/useComments.tsx"
import { useQueryParams } from "../hooks/useQueryParams.ts"
import type { Comment } from "../entities/Comment/Comment.ts"
import { Button } from "../components"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { highlightText } from "./highlightText.tsx"

export function CommentsList({ post }: { post: Post }) {
  const { setNewComment, setShowAddCommentDialog, setSelectedComment, setShowEditCommentDialog } = useApp()
  const { comments, setComments } = useComments()
  const { searchQuery } = useQueryParams()

  const postId = post.id

  function handleCommentAdd() {
    setNewComment((prev) => ({ ...prev, postId }))
    setShowAddCommentDialog(true)
  }

  // 댓글 삭제
  async function handleCommentDelete(comment: Comment, postId: number) {
    try {
      await fetch(`/api/comments/${comment.id}`, { method: "DELETE" })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== comment.id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  async function handleCommentLike(comment: Comment, postId: number) {
    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: comment.likes + 1 }),
      })
      const data = await response.json()
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  function handleCommentEdit(comment: Comment) {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>

        <Button size="sm" onClick={handleCommentAdd}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>

      <div className="space-y-1">
        {comments[postId]?.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" onClick={() => handleCommentLike(comment, postId)}>
                <ThumbsUp className="w-3 h-3" />
                <span className="ml-1 text-xs">{comment.likes}</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={() => handleCommentEdit(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>

              <Button variant="ghost" size="sm" onClick={() => handleCommentDelete(comment, postId)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
