import { User, UsersApiResponse } from "../types"

export const fetchUsers = async (params?: string): Promise<UsersApiResponse> => {
  const url = params ? `/api/users?${params}` : "/api/users"
  const response = await fetch(url)
  return response.json()
}

export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}