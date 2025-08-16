import type { User } from "../model/User"
import ky from "ky"

interface UsersResponse {
  users: User[]
  total: number
}

export async function fetchUserProfiles(): Promise<UsersResponse> {
  const searchParams = { limit: 0, select: "username,image" }
  return ky.get("/api/users", { searchParams }).json()
}

export async function fetchUser(id: number): Promise<User> {
  return ky.get(`/api/users/${id}`).json()
}
