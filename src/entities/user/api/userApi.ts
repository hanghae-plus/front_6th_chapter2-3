import { User } from "../model/types"

export const userApi = {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`)
    return response.json()
  },

  async getUsersList(): Promise<{ users: User[] }> {
    const response = await fetch("/api/users?limit=0&select=username,image")
    return response.json()
  },
}
