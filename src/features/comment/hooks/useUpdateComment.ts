import { useState } from "react"
import { useModal } from "../../open-modal/useModal"
import { Comment } from "../../../entities/comment/model"
import { updateComment } from "../../../entities/comment/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ListResponse } from "../../../shared/types/types"

export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  const modal = useModal("editComment")
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const queryKey = ["comments", selectedComment?.postId ?? 0]

  /**
   * 댓글 수정 모달 열기
   * @param comment 수정할 댓글
   */
  const handleClickUpdateComment = (comment: Comment) => {
    setSelectedComment(comment)
    modal.open()
  }

  /**
   * 댓글 내용 변경
   * @param body 변경할 댓글 내용
   */
  const handleChangeComment = (body: string) => {
    if (selectedComment) {
      setSelectedComment((prev) => {
        if (!prev) return null
        return { ...prev, body }
      })
    }
  }

  const updateCommentMutation = useMutation({
    mutationFn: updateComment,
    onMutate: async (updatedComment) => {
      await queryClient.cancelQueries({ queryKey })
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)),
      }))
      return { mutateId: updatedComment.id }
    },
    onSuccess: (res, _vars, ctx) => {
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) => (comment.id === ctx?.mutateId ? res : comment)),
      }))
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) => (comment.id === ctx?.mutateId ? _e : comment)),
      }))
    },
    onSettled: () => {
      modal.close()
      setSelectedComment(null)
    },
  })

  return {
    modal,
    action: {
      open: handleClickUpdateComment,
      change: handleChangeComment,
      update: updateCommentMutation.mutate,
    },
    state: {
      selectedComment,
    },
  }
}
