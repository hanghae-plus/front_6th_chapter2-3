import { PostSearchParams } from "@/entities/post/model"

export const postQueryKeys = {
  all: ["posts"],
  list: (filters: PostSearchParams) => [...postQueryKeys.all, filters],
}

export const userQueryKeys = {
  all: ["users"],
  basic: () => [...userQueryKeys.all, "basic"],
  user: (userId: number) => [...userQueryKeys.all, userId],
}

export const queryKeys = {
  posts: postQueryKeys,
  users: userQueryKeys,
}
