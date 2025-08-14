import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useComments } from "@/features/comment/read-comment/model/useComments"
import { useCreateComment } from "@/features/comment/create-comment/model"
import { CommentItem } from "@/entities/comment/ui"
import { commentKeys } from "@/entities/comment/model/query-key"
import { Comment, CreateComment } from "@/shared/types"
import { HttpClient } from "@/shared/api/http"
import { useDialogActions, useDialogStore } from "@/shared/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Textarea, EditCommentDialog } from "@/shared/ui"
import { usePostDetail } from "../model"

interface DetailPostDialogProps {
  postId: number | null
}

export const DetailPostDialog = ({ postId }: DetailPostDialogProps) => {
  const isOpen = useDialogStore((state) => state.dialogs.POST_DETAIL)
  const isEditCommentOpen = useDialogStore((state) => state.dialogs.EDIT_COMMENT)
  const { hideDialog, showDialog } = useDialogActions()
  const queryClient = useQueryClient()

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false) // 댓글 추가 대화상자
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null) // 선택된 댓글
  const [newComment, setNewComment] = useState<CreateComment>({ body: "", postId: 0, userId: 1 }) // 새 댓글 데이터

  // postId가 변경될 때 상태 초기화
  useEffect(() => {
    if (postId) {
      setNewComment((prev) => ({ ...prev, postId }))
      setSelectedComment(null)
      setShowAddCommentDialog(false)
    }
  }, [postId])

  // postId가 유효할 때만 쿼리 실행
  const { data, isLoading, error } = usePostDetail(postId)
  const { data: commentsData } = useComments(postId)
  const createCommentMutation = useCreateComment()

  // postId가 없거나 다이얼로그가 닫혀있으면 렌더링하지 않음
  if (!postId || !isOpen) return null

  // 로딩 중일 때
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

  // 에러가 있거나 데이터가 없을 때
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

  const addComment = async () => {
    if (!postId) return

    try {
      await createCommentMutation.mutateAsync({
        body: newComment.body,
        postId: postId,
        userId: newComment.userId,
      })

      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId: 0, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  // TODO : 댓글 추가 으로 분리
  const updateComment = async (commentId: number, body: string) => {
    if (!postId) return

    try {
      await HttpClient.put<Comment>(`/comments/${commentId}`, {
        body: body,
      })

      // 댓글 수정 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })
      queryClient.invalidateQueries({ queryKey: commentKeys.listByPost(postId) })
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
    if (!postId) return

    try {
      const comment = commentsData?.comments?.find((c) => c.id === id)
      if (!comment) return

      await HttpClient.patch<Comment>(`/comments/${id}`, {
        likes: comment.likes + 1,
      })

      // 좋아요 후 쿼리 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["posts", "detail", postId] })
      queryClient.invalidateQueries({ queryKey: commentKeys.listByPost(postId) })
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  // TODO: 댓글 위젯으로 분리
  const renderComments = () => {
    return (
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
        {!commentsData ? (
          <div className="text-center py-4">댓글 로딩 중...</div>
        ) : (
          <div className="space-y-1">
            {commentsData.comments?.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={likeComment}
                onEdit={(comment) => {
                  setSelectedComment(comment)
                  showDialog("EDIT_COMMENT")
                }}
                onDelete={deleteComment}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

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

      <EditCommentDialog
        open={isEditCommentOpen}
        onOpenChange={(open) => {
          if (!open) {
            hideDialog("EDIT_COMMENT")
            setSelectedComment(null)
          }
        }}
        comment={selectedComment}
        onUpdate={updateComment}
      />
    </>
  )
}
