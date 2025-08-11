import fetchClient from "../../../shared/utils/fetchClient"
import { User } from "./types"

export const fetchUserApi = async (id: number): Promise<User> => {
  return fetchClient<User>(`/users/${id}`)
}
