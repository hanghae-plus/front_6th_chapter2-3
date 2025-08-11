import { Posts } from "./type"

export const getPosts = async (limit: number, skip: number) => {
  const res = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)

  if (!res.ok) {
    return { result: false }
  }

  const posts = (await res.json()) as Posts

  return { result: true, posts }
}

export const getSeachPosts = async (searchQuery: string) => {
  const res = await fetch(`/api/posts/search?q=${searchQuery}`)

  if (!res.ok) {
    return { result: false }
  }

  const posts = (await res.json()) as Posts

  return { result: true, posts }
}

export const getPostsByTag = async (tag: string) => {
  const res = await fetch(`/api/posts/tag/${tag}`)

  if (!res.ok) {
    return { result: false }
  }

  const posts = (await res.json()) as Posts

  return { result: true, posts }
}
