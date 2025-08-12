import type { getUsersRequestParamsSchema } from "../model"
import { getUser, getUsers } from "./user.api"

import { queryOptions } from "@tanstack/react-query"
import type z from "zod"

export const userEntityQueries = {
  all: ["users"] as const,
  getUsersKey: (requestParams: z.infer<typeof getUsersRequestParamsSchema>) =>
    [...userEntityQueries.all, "getUsers", requestParams] as const,
  getUsers: (requestParams: z.infer<typeof getUsersRequestParamsSchema>) =>
    queryOptions({
      queryKey: userEntityQueries.getUsersKey(requestParams),
      queryFn: () => getUsers(requestParams),
    }),

  getUserKey: (userId: number) => [...userEntityQueries.all, "getUser", userId] as const,
  getUser: (userId: number) =>
    queryOptions({
      queryKey: userEntityQueries.getUserKey(userId),
      queryFn: () => getUser(userId),
    }),
}
