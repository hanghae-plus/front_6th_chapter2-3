import fetchClient from "../../../shared/api/fetchClient"
import { UserDto } from "./types"

type FetchUsersRes = {
  users: UserDto[]
}

export const fetchUsersApi = async (): Promise<FetchUsersRes> => {
  return fetchClient<FetchUsersRes>("/users?limit=0&select=username,image")
}
