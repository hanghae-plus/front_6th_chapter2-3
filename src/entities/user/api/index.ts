import { createApiUrl } from "@shared/lib"
import { User, UsersApiResponse } from "@entities/user/model/types"

// Export hooks
export * from "./queries"

export const fetchUsers = async (params?: string): Promise<UsersApiResponse> => {
  const path = params ? `users?${params}` : "users"
  const response = await fetch(createApiUrl(path))
  return response.json()
}

export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(createApiUrl(`users/${id}`))
  return response.json()
}
