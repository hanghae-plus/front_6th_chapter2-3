import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { useComments } from "@/features/comment/read-comment/model/useComments"
import { useCreateComment } from "@/features/comment/create-comment/model"
import { useUpdateComment } from "@/features/comment/update-comment/model"
import { useDeleteComment } from "@/features/comment/delete-comment/model"
import { useLikeComment } from "@/features/comment/like-comment/model"
import { AddCommentDialog } from "@/features/comment/create-comment/ui"
import { CommentItem } from "@/entities/comment/ui"
import { Comment, CreateComment } from "@/entities/comment/model"
import { useDialogActions, useDialogStore } from "@/shared/model"
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, EditCommentDialog } from "@/shared/ui"
import { usePostDetail } from "../model"

interface DetailPostDialogProps {
  postId: number | null
}

export const DetailPostDialog = ({ postId }: DetailPostDialogProps) => {
  const isOpen = useDialogStore((state) => state.dialogs.POST_DETAIL)
  const isEditCommentOpen = useDialogStore((state) => state.dialogs.EDIT_COMMENT)
  const isAddCommentOpen = useDialogStore((state) => state.dialogs.ADD_COMMENT)
  const { hideDialog, showDialog } = useDialogActions()

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null) // 선택된 댓글

  // postId가 변경될 때 상태 초기화
  useEffect(() => {
    if (postId) {
      setSelectedComment(null)
    }
  }, [postId])

  // postId가 유효할 때만 쿼리 실행
  const { data, isLoading, error } = usePostDetail(postId)
  const { data: commentsData } = useComments(postId)
  const createCommentMutation = useCreateComment()
  const updateCommentMutation = useUpdateComment()
  const deleteCommentMutation = useDeleteComment()
  const likeCommentMutation = useLikeComment()

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

  const handleAddComment = async (comment: CreateComment) => {
    if (!postId) return

    try {
      await createCommentMutation.mutateAsync({
        body: comment.body,
        postId: postId,
        userId: comment.userId,
      })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  const updateComment = async (commentId: number, body: string) => {
    if (!postId) return

    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        body,
      })
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  const deleteComment = async (id: number) => {
    if (!postId) return

    try {
      await deleteCommentMutation.mutateAsync({
        commentId: id,
        postId: postId,
      })
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  const likeComment = async (id: number) => {
    if (!postId) return

    try {
      const comment = commentsData?.comments?.find((c: Comment) => c.id === id)
      if (!comment) return

      await likeCommentMutation.mutateAsync({
        commentId: id,
        postId: postId,
        currentLikes: comment.likes,
      })
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
          <Button size="sm" onClick={() => showDialog("ADD_COMMENT")}>
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>

        {/* 댓글 목록 */}
        {!commentsData ? (
          <div className="text-center py-4">댓글 로딩 중...</div>
        ) : (
          <div className="space-y-1">
            {commentsData.comments?.map((comment: Comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={likeComment}
                onEdit={(comment: Comment) => {
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
      <AddCommentDialog
        open={isAddCommentOpen}
        onOpenChange={(open) => {
          if (!open) {
            hideDialog("ADD_COMMENT")
          }
        }}
        postId={postId}
        onSubmit={handleAddComment}
      />

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
