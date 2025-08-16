import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Comments, CommentsResponse, CreateCommentRequest, LikeCommentRequest, UpdateCommentRequest } from "./types"
import { commentQueryKeys } from "./queryKeys.ts"
import { createComment, deleteComment, getComments, likeComment, updateComment } from "../api"

// query
export const useGetCommentsQuery = (postId: number) =>{

  return useQuery<CommentsResponse>({
    queryKey: commentQueryKeys.list(postId),
    queryFn: () => getComments(postId),
    enabled: !!postId
  })
}

// mutation
// TODO 낙관적 업데이트
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateCommentRequest) => createComment(payload),
    onSuccess: (response) => {
      if(!response.postId) return
      queryClient.setQueryData<Comments>(commentQueryKeys.list(response.postId), (old) =>
        old ? { ...old, comments: [response, ...old.comments], total: (old.total ?? 0) + 1 } : old)
    }
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UpdateCommentRequest ) => updateComment(payload.id, { body: payload.body }),

    onSuccess: (response, { id }) => {
    queryClient.setQueryData<Comments>(commentQueryKeys.list(id), (old) => {

        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((comment) => (comment.id === response.id ? response : comment)),
        }
      })
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => deleteComment(id),
    onSuccess: (_response, { postId, id }) => {
      queryClient.setQueryData<CommentsResponse>(commentQueryKeys.list(postId), (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.filter((comment) => comment.id !== id),
          total: Math.max(0, (old.total ?? 0) - 1),
        }
      })
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LikeCommentRequest) => {
      return likeComment(payload.id, currentlikes);
    },

    // 낙관적 업데이트 적용
    onMutate: async (payload) => {
      const key = commentQueryKeys.list(payload.postId);

      // 1) 진행 중 쿼리 중단
      await queryClient.cancelQueries({ queryKey: key });

      // 2) 스냅샷 저장(롤백용)
      const previous = queryClient.getQueryData<CommentsResponse>(key);

      // 3) 즉시 캐시 반영(+1)
      queryClient.setQueryData<CommentsResponse>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === payload.id ? { ...comment, likes: (comment.likes ?? 0) + 1 } : comment
          ),
        };
      });

      // 4) 롤백 컨텍스트 반환
      return { key, previous };
    },
    onSuccess: (response) => {
      const key = commentQueryKeys.list(response.postId)
      queryClient.setQueryData<CommentsResponse>(key, (old) => {
        if (!old) return old
        return {
          ...old,
          comments: old.comments.map((comment) =>
            comment.id === response.id ? { ...comment, likes: response.likes } : comment
          ),
        }
      })
    },
  })
}