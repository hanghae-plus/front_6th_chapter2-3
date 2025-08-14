import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { URL_PATH } from "../config/routes"
import { commentsAtom } from "../stores/postsAtoms"

// 댓글 목록 조회
export const useComments = (postId: number) => {
  const [comments, setComments] = useAtom(commentsAtom)

  return useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      if (comments[postId]) return comments[postId] // 이미 불러온 댓글이 있으면 다시 불러오지 않음
      const response = await fetch(URL_PATH.COMMENTS.BY_POST(postId))
      const data = await response.json()
      setComments((prev) => ({ ...prev, [postId]: data.comments }))
      return data.comments
    },
    enabled: !!postId,
  })
}

// 댓글 생성
export const useCreateComment = () => {
  const queryClient = useQueryClient()
  const [comments, setComments] = useAtom(commentsAtom)

  return useMutation({
    mutationFn: async (commentData: { body: string; postId: number | null; userId: number }) => {
      const response = await fetch(URL_PATH.COMMENTS.ADD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      })
      return response.json()
    },
    onSuccess: (data) => {
      setComments((prev) => ({
        ...prev,
        [data.postId]: [...(prev[data.postId] || []), data],
      }))
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
  })
}

// 댓글 수정
export const useUpdateComment = () => {
  const queryClient = useQueryClient()
  const [comments, setComments] = useAtom(commentsAtom)

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { body: string } }) => {
      const response = await fetch(URL_PATH.COMMENTS.UPDATE(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: (data) => {
      setComments((prev) => ({
        ...prev,
        [data.postId]: prev[data.postId].map((comment) => (comment.id === data.id ? data : comment)),
      }))
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
  })
}

// 댓글 삭제
export const useDeleteComment = () => {
  const queryClient = useQueryClient()
  const [comments, setComments] = useAtom(commentsAtom)

  return useMutation({
    mutationFn: async ({ id, postId }: { id: number; postId: number }) => {
      await fetch(URL_PATH.COMMENTS.DELETE(id), {
        method: "DELETE",
      })
      return { id, postId }
    },
    onSuccess: (_, { postId, id }) => {
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
      queryClient.invalidateQueries({ queryKey: ["comments", postId] })
    },
  })
}

// 댓글 좋아요
export const useLikeComment = () => {
  const queryClient = useQueryClient()
  const [comments, setComments] = useAtom(commentsAtom)

  return useMutation({
    mutationFn: async ({ id, likes }: { id: number; likes: number }) => {
      const response = await fetch(URL_PATH.COMMENTS.UPDATE(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes }),
      })
      return response.json()
    },
    onSuccess: (data) => {
      setComments((prev) => ({
        ...prev,
        [data.postId]:
          prev[data.postId]?.map((comment) =>
            comment.id === data.id ? { ...data, likes: comment.likes + 1 } : comment,
          ) || [],
      }))
      queryClient.invalidateQueries({ queryKey: ["comments", data.postId] })
    },
  })
}
