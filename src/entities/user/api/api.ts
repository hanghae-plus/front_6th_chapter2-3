import { http } from "../../../shared/lib/http-client"
import type { User } from "../model"

export interface UsersResponse {
  users: User[]
}

export interface FetchUsersParams {
  limit?: number
  select?: string
}

export const userApi = {
  getUsers: async (params?: FetchUsersParams): Promise<UsersResponse> => {
    const defaultParams = { limit: 0, select: "username,image" }
    return http.get<UsersResponse>("/users", { params: { ...defaultParams, ...params } })
  },

  getUser: async (id: number): Promise<User> => {
    return http.get<User>(`/users/${id}`)
  },
}
