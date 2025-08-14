import { useState } from "react"
import { Edit2, Plus, ThumbsUp, Trash2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { Comment, CreateComment } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"
import { useDialogActions, useDialogStore } from "@/shared/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea } from "@/shared/ui"
import { usePostDetail } from "../model"

interface DetailPostDialogProps {
  postId: number | null
}

export const DetailPostDialog = ({ postId }: DetailPostDialogProps) => {
  const isOpen = useDialogStore((state) => state.dialogs.POST_DETAIL)
  const { hideDialog } = useDialogActions()
  const queryClient = useQueryClient()

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false) // 댓글 추가 대화상자
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false) // 댓글 수정 대화상자
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null) // 선택된 댓글
  const [newComment, setNewComment] = useState<CreateComment>({ body: "", postId: 0, userId: 1 }) // 새 댓글 데이터

  const { data, isLoading, error } = usePostDetail(postId)

  const addComment = async () => {
    if (!postId) return

    try {
      await HttpClient.post<Comment>("/comments/add", {
        body: newComment.body,
        postId: postId,
        userId: newComment.userId,
      })

      // 댓글 추가 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })

      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // TODO : 댓글 추가 으로 분리
  const updateComment = async () => {
    if (!selectedComment || !postId) return

    try {
      await HttpClient.put<Comment>(`/comments/${selectedComment.id}`, {
        body: selectedComment.body,
      })

      // 댓글 수정 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })

      setShowEditCommentDialog(false)
      setSelectedComment(null)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // TODO : 댓글 삭제 훅으로 분리
  const deleteComment = async (id: number) => {
    if (!postId) return

    try {
      await HttpClient.delete(`/comments/${id}`)

      // 댓글 삭제 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // TODO: 댓글 좋아요 훅으로 분리
  const likeComment = async (id: number) => {
    if (!postId || !data) return

    try {
      const comment = data.comments.find((c) => c.id === id)
      if (!comment) return

      await HttpClient.patch<Comment>(`/comments/${id}`, {
        likes: comment.likes + 1,
      })

      // 좋아요 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // TODO: 댓글 위젯으로 분리
  const renderComments = () => (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">댓글</h3>
        {/* 댓글 추가 버튼 */}
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId: postId || 0 }))
            setShowAddCommentDialog(true)
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>

      {/* 댓글 목록 */}
      {/* <div className="space-y-3">
        {data?.comments.map((comment) => (
          <div key={comment.id} className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 overflow-hidden flex-1">
                <span className="font-medium text-sm">{comment.user.username}:</span>
                <span className="text-sm">{comment.body}</span>
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Button variant="ghost" size="sm" onClick={() => likeComment(comment.id)}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedComment(comment)
                    setShowEditCommentDialog(true)
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>

                <Button variant="ghost" size="sm" onClick={() => deleteComment(comment.id)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  )

  if (!postId || !isOpen) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>로딩 중</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8">로딩 중...</div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !data) {
    return (
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>오류</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-8 text-red-500">데이터를 불러오는데 실패했습니다.</div>
        </DialogContent>
      </Dialog>
    )
  }

  const { post } = data

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => hideDialog("POST_DETAIL")}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{post.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{post.body}</p>
            {renderComments()}
          </div>
        </DialogContent>
      </Dialog>

      {/* 댓글 추가 대화상자 */}
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

      {/* 댓글 수정 대화상자 */}
      <Dialog open={showEditCommentDialog} onOpenChange={setShowEditCommentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>댓글 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="댓글 내용"
              value={selectedComment?.body || ""}
              onChange={(e) =>
                setSelectedComment(selectedComment ? { ...selectedComment, body: e.target.value } : null)
              }
            />
            <Button onClick={updateComment}>댓글 업데이트</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
