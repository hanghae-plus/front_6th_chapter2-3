import { Comments } from "./type"

export const getComments = async (postId: number) => {
  const res = await fetch(`/api/comments/post/${postId}`)

  if (!res.ok) {
    return { result: false }
  }

  const comments = (await res.json()) as Comments

  return { result: true, comments }
}
