import { http } from "../../../shared/lib/http-client"
import type { User, UsersResponse } from "../../../shared/types"

export const userApi = {
  getUsers: async (): Promise<UsersResponse> => {
    return http.get<UsersResponse>("/users", { params: { limit: 0, select: "username,image" } })
  },

  getUser: async (id: number): Promise<User> => {
    return http.get<User>(`/users/${id}`)
  },
}
