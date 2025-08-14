/**
 * Posts API client — fetch 래퍼 함수 및 CRUD 호출 모음
 */

// 타입 정의 (필요시 추후 entities/post/model 로 이동 가능)
export interface Address {
  address: string
  city: string
  [key: string]: unknown
}

export interface User {
  id: number
  username: string
  image: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: Address
  [key: string]: unknown
}

export interface Post {
  id: number
  title: string
  body: string
  userId: number
  tags?: string[]
  reactions?: { likes: number; dislikes: number }
  author?: User
  [key: string]: unknown
}

export interface Comment {
  id: number
  postId: number
  body: string
  likes: number
  user: User
  [key: string]: unknown
}

export interface PostsResponse {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

/**
 * 공통 JSON fetch 래퍼
 */
const jsonFetch = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) throw new Error(`API request failed: ${res.status} ${res.statusText}`)
  return res.json() as Promise<T>
}

const fetchUsersMap = async () => {
  const usersResp = await jsonFetch<{ users: User[] }>('/api/users?limit=0&select=username,image')
  const map = new Map<number, User>()
  usersResp.users.forEach((u) => map.set(u.id, u))
  return map
}

const enrichPosts = async (promise: Promise<PostsResponse>): Promise<PostsResponse> => {
  const [postsData, usersMap] = await Promise.all([promise, fetchUsersMap()])
  postsData.posts = postsData.posts.map((p) => ({ ...p, author: usersMap.get(p.userId) }))
  return postsData
}

/* ----------------------------- READ ----------------------------- */
export const getPosts = (skip = 0, limit = 10) =>
  enrichPosts(jsonFetch<PostsResponse>(`/api/posts?limit=${limit}&skip=${skip}`))

export const getPostsByTag = (tag: string) =>
  enrichPosts(jsonFetch<PostsResponse>(`/api/posts/tag/${tag}`))

export const searchPosts = (query: string) =>
  enrichPosts(jsonFetch<PostsResponse>(`/api/posts/search?q=${encodeURIComponent(query)}`))

export const getTags = () =>
  jsonFetch<Array<{ slug: string; url: string }>>('/api/posts/tags')

export const getPostDetail = (id: number) =>
  jsonFetch<Post>(`/api/posts/${id}`)

/* ---------------------------- MUTATION --------------------------- */
export const addPost = (post: Omit<Post, 'id'>) =>
  jsonFetch<Post>('/api/posts/add', {
    method: 'POST',
    body: JSON.stringify(post),
  })

export const updatePost = (post: Post) =>
  jsonFetch<Post>(`/api/posts/${post.id}`, {
    method: 'PUT',
    body: JSON.stringify(post),
  })

export const deletePost = (id: number) =>
  jsonFetch<void>(`/api/posts/${id}`, { method: 'DELETE' })
