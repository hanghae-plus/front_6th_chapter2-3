import { http } from "@shared/lib/api/http"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useGetUserDetail } from "@entities/user/hooks/queries/useGetUserDetail"
import { COMMENT_QUERY_KEY } from "@entities/comment/const"
import { GetCommentResponse } from "@entities/comment/hooks/queries/useGetComment"

export interface CreateCommentBody {
  body: string
  postId: number | null
  userId: number
}

const createComment = async (formData: CreateCommentBody) => {
  const response = await http.post("/comments/add", formData)

  return response
}

export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const { data: currentUser } = useGetUserDetail(1) // userId 1의 사용자 정보 가져오기

  return useMutation({
    mutationFn: createComment,
    onSuccess: (_, variables) => {
      // 가짜 API이므로 클라이언트에서 직접 캐시 업데이트
      if (variables.postId && currentUser) {
        queryClient.setQueryData(COMMENT_QUERY_KEY.detail([variables.postId]), (oldData: GetCommentResponse) => {
          if (!oldData) return oldData

          // 새 댓글을 목록에 추가 (userId 1의 실제 사용자 정보 사용)
          return {
            ...oldData,
            comments: [
              ...oldData.comments,
              {
                id: Date.now(), // 임시 ID
                body: variables.body,
                postId: variables.postId,
                user: {
                  id: currentUser.id,
                  username: currentUser.username,
                  image: currentUser.image,
                },
                likes: 0,
              },
            ],
            total: oldData.total + 1,
          }
        })
      }
    },
  })
}
