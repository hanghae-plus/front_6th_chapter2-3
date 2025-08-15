export interface Post {
  body: string
  id: number
  reactions?: Reaction
  tags?: string[]
  title: string
  userId: number
}

export type PostPagiantionReponse<T> = { limit: number; posts: T[]; skip: number; total: number }

export interface PostQueryParams {
  limit: number
  order: "asc" | "desc"
  search: string
  skip: number
  sortBy: "" | "id" | "none" | "reactions" | "title"
}
export type PostsResponse = PostPagiantionReponse<Post>

export interface SearchQueryParams {
  q?: string
}

type Reaction = { dislikes: number; likes: number }
