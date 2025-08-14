import type { Tag } from "../lib/types"
import { API_BASE_URL } from "../lib/env"

export const fetchTags = async (): Promise<Tag[]> => {
  const response = await fetch(`${API_BASE_URL}/posts/tags`)
  if (!response.ok) throw new Error("Failed to fetch tags")
  return response.json()
}
