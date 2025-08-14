import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useModal } from "../../open-modal/useModal"
import { addComment } from "../../../entities/comment/api"
import { useState } from "react"
import { Comment, CommentRequest } from "../../../entities/comment/model"
import { ListResponse } from "../../../shared/types/types"
import { COMMENT_CONST } from "../constant/constant"

const initialComment: CommentRequest = { body: "", postId: 0, userId: 1 }

export const useAddComment = () => {
  const queryClient = useQueryClient()
  const modal = useModal("addComment")
  const [newComment, setNewComment] = useState<CommentRequest>(initialComment)
  const queryKey = ["comments", newComment.postId]

  /**
   * 댓글 추가 모달 열기
   * @param postId 댓글을 추가할 게시글의 ID
   */
  const handleClickAddComment = (postId: number) => {
    setNewComment((prev) => ({ ...prev, postId }))
    modal.open()
  }

  /**
   * 댓글 내용 변경
   * @param body 변경할 댓글 내용
   */
  const handleChangeComment = (body: string) => {
    setNewComment((prev) => ({ ...prev, body }))
  }

  /**
   * 댓글 추가 뮤테이션
   */
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      // 임시 ID 생성
      const tempCommentId = COMMENT_CONST.TEMP_ID
      // 뮤테이션 취소를 위해 쿼리 캔슬
      await queryClient.cancelQueries({ queryKey })
      // 이전 댓글 데이터 가져오기
      const previousComments = queryClient.getQueryData(queryKey)
      // 이전 댓글 데이터에 새 댓글 추가
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
      // 임시 ID를 가진 댓글을 실제 댓글로 변경
      queryClient.setQueryData(queryKey, (old: ListResponse<"comments", Comment>) => ({
        ...old,
        comments: old.comments.map((comment) => (comment.id === COMMENT_CONST.TEMP_ID ? res : comment)),
      }))
    },
    onError: (_e, _v, ctx) => {
      // 뮤테이션 취소
      if (ctx?.previousComments !== undefined) {
        queryClient.setQueryData(queryKey, ctx.previousComments)
      }
    },
    onSettled: () => {
      // 모달 닫기 및 상태 초기화
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
