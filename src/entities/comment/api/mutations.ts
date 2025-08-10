import { AddCommentRequest, commentApi } from "./api"
import { commentQueries } from "./queries"

export const commentMutations = {
  addMutation: () => ({
    mutationKey: [...commentQueries.all(), "add"] as const,
    mutationFn: (comment: AddCommentRequest) => commentApi.addComment(comment),
  }),

  updateMutation: () => ({
    mutationKey: [...commentQueries.all(), "update"] as const,
    mutationFn: ({ id, body }: { id: number; body: string }) => commentApi.updateComment(id, body),
  }),

  deleteMutation: () => ({
    mutationKey: [...commentQueries.all(), "delete"] as const,
    mutationFn: (id: number) => commentApi.deleteComment(id),
  }),

  likeMutation: () => ({
    mutationKey: [...commentQueries.all(), "like"] as const,
    mutationFn: ({ id, likes }: { id: number; likes: number }) => commentApi.likeComment(id, likes),
  }),
}
