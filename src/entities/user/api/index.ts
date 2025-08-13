import { apiClient } from "../../../shared/api/base"
import { User } from "../model/types"

export const userApi = {
  async getUser(id: number): Promise<User> {
    return await apiClient.get<User>(`/users/${id}`)
  },

  async getUsersList(): Promise<{ users: User[] }> {
    return await apiClient.get<{ users: User[] }>("/users?limit=0&select=username,image")
  },
}
