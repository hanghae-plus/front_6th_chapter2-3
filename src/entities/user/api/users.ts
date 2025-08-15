import type { UserDetails, UserSummary } from "../model/types"
import { API_BASE_URL } from "../../../shared/lib/env"

export const fetchUsersSummary = async (): Promise<{ users: UserSummary[] }> => {
  const response = await fetch(`${API_BASE_URL}/users?limit=0&select=username,image`)
  if (!response.ok) throw new Error("Failed to fetch users summary")
  return response.json()
}

export const fetchUserDetails = async (userId: number): Promise<UserDetails> => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`)
  if (!response.ok) throw new Error("Failed to fetch user details")
  return response.json()
}
