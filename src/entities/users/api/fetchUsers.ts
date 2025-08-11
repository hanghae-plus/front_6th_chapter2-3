import fetchClient from "../../../shared/utils/fetchClient"
import { User } from "./types"

type FetchUsersRes = {
  users: User[]
}

export const fetchUsersApi = async (): Promise<FetchUsersRes> => {
  return fetchClient<FetchUsersRes>("/users?limit=0&select=username,image")
}
