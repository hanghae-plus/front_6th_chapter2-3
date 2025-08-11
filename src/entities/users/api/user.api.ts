import { httpClient } from "@/shared/lib"
import z from "zod"
import { getUsersRequestParamsSchema, getUsersResponseSchema, userDetailSchema } from "../model"

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
