import { httpClient } from "@/shared/lib"

import type { userDetailSchema } from "../model"
import { getUsersRequestParamsSchema, getUsersResponseSchema } from "../model"

import type z from "zod"

export const getUsers = async (requestParams: z.infer<typeof getUsersRequestParamsSchema>) => {
  const parsedRequestParams = getUsersRequestParamsSchema.parse(requestParams)

  const response = await httpClient.get<z.infer<typeof getUsersResponseSchema>>("/api/users", {
    params: parsedRequestParams,
  })

  return getUsersResponseSchema.parse(response.data)
}

export const getUser = async (userId: number) => {
  const response = await httpClient.get<z.infer<typeof userDetailSchema>>(`/api/users/${userId}`)

  return response.data
}
