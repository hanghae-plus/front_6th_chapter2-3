import { requestApi } from "../../shared/lib"
import { User, Users } from "./type"

export const getUsers = async () => {
  return await requestApi<Users>("/users?limit=0&select=username,image")
}

export const getUser = async (id: number) => {
  return await requestApi<User>(`/users/${id}`)
}
