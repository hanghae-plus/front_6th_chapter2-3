import ky from "ky"
import type { Tag } from "../model/Tag"

export async function fetchTags(): Promise<Tag[]> {
  return ky.get("/api/posts/tags").json()
}
