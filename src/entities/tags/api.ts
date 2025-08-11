import { Tags } from "./type"

export const getTags = async () => {
  const res = await fetch("/api/posts/tags")

  if (!res.ok) {
    return { result: false }
  }

  const tags = (await res.json()) as Tags

  return { result: true, tags }
}
