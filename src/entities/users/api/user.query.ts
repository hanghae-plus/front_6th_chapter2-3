import { createEntityQueries } from "@/shared/lib"

import type { getUsersRequestParamsSchema } from "../model"
import { getUser, getUsers } from "./user.api"

import type z from "zod"

const factory = createEntityQueries("users")

const getUsersQ = factory.build<z.infer<typeof getUsersRequestParamsSchema>, Awaited<ReturnType<typeof getUsers>>>(
  "getUsers",
  getUsers,
)
const getUserQ = factory.build<number, Awaited<ReturnType<typeof getUser>>>("getUser", getUser)

export const userEntityQueries = {
  all: factory.all,
  getUsersKey: getUsersQ.getKey,
  getUsers: getUsersQ.getOptions,
  getUserKey: getUserQ.getKey,
  getUser: getUserQ.getOptions,
}
