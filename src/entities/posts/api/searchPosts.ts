import fetchClient from "../../../shared/utils/fetchClient"
import { Post } from "./types"

type SearchPostsReq = {
  query: string
}

type SearchPostsRes = {
  posts: Post[]
  total: number
}

export const searchPostsApi = async ({ query }: SearchPostsReq): Promise<SearchPostsRes> => {
  return fetchClient<SearchPostsRes>(`/posts/search?q=${query}`)
}
