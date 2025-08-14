import fetchClient from "../../../shared/api/fetchClient"
import { UserDto } from "./types"

export const fetchUserApi = async (id: number): Promise<UserDto> => {
  return fetchClient<UserDto>(`/users/${id}`)
}
