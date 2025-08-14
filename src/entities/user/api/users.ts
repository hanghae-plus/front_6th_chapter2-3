import type * as UserModels from "@/entities/user/model"
import { fetcher } from "@/shared/api"

export async function fetchUsers({ limit }: UserModels.FetchUsers.Payload) {
  const searchParams = { limit, select: "username,image" }
  const response = await fetcher.get(`/users`, { searchParams })
  return response.json<UserModels.FetchUsers.Response>()
}

export async function fetchUserById({ id }: UserModels.FetchUserById.Payload) {
  const searchParams = {
    select: "image,username,firstName,lastName,age,email,phone,address,city,state,name,title,company",
  }
  const response = await fetcher.get(`/users/${id}`, { searchParams })
  return response.json<UserModels.FetchUserById.Response>()
}
