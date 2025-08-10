import { postApi } from "./api"
import { postQueries } from "./queries"
import { queryClient } from "../../../shared/config/query-client"
import type { CreatePostRequest, UpdatePostRequest } from "./api"

export const postMutations = {
  addMutation: () => ({
    mutationKey: [...postQueries.all(), "add"] as const,
    mutationFn: (post: CreatePostRequest) => postApi.addPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueries.all(),
      })
    },
  }),

  updateMutation: () => ({
    mutationKey: [...postQueries.all(), "update"] as const,
    mutationFn: ({ id, post }: { id: number; post: UpdatePostRequest }) => postApi.updatePost(id, post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueries.all(),
      })
    },
  }),

  deleteMutation: () => ({
    mutationKey: [...postQueries.all(), "delete"] as const,
    mutationFn: (id: number) => postApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: postQueries.all(),
      })
    },
  }),
}
