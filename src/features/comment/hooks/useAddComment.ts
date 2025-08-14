import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useModal } from "../../open-modal/useModal"
import { addComment } from "../../../entities/comment/api"
import { useState } from "react"
import { Comment, CommentRequest } from "../../../entities/comment/model"
import { ListResponse } from "../../../shared/types/types"
import { COMMENT_CONST } from "../constant/constant"
import { tempIdGenerator } from "../../../shared/utils/tempIdGenerator"

const initialComment: CommentRequest = { body: "", postId: 0, userId: 1 }

export const useAddComment = () => {
  const modal = useModal("addComment")
  const [newComment, setNewComment] = useState<CommentRequest>(initialComment)

  const handleClickAddComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    modal.open()
  }

  const handleChangeComment = (body: string) => {
    setNewComment((prev) => ({ ...prev, body }))
  }

  const queryClient = useQueryClient()
  const queryKey = ["comments", newComment.postId]

  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      const tempCommentId = COMMENT_CONST.TEMP_ID
      await queryClient.cancelQueries({ queryKey })
      const previousComments = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: [
          ...old.comments,
          {
            id: tempCommentId,
            body: newComment.body,
            postId: newComment.postId,
            likes: COMMENT_CONST.DEFAULT_LIKES,
            user: COMMENT_CONST.DEFAULT_USER,
          },
        ],
      }))
      return { previousComments }
    },
    onSuccess: (res) => {
      console.log("comment업로드 성공", res)
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) => (comment.id === COMMENT_CONST.TEMP_ID ? res : comment)),
      }))
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previousComments !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previousComments)
      }
    },
    onSettled: () => {
      modal.close()
      setNewComment(initialComment)
    },
  })

  return {
    state: {
      newComment,
    },
    modal,
    action: {
      open: handleClickAddComment,
      change: handleChangeComment,
      add: addCommentMutation.mutate,
    },
  }
}
