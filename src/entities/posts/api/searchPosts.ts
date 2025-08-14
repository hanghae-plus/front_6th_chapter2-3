import fetchClient from "../../../shared/api/fetchClient"
import { PostApi } from "./types"

type SearchPostsReq = {
  query: string
}

type SearchPostsRes = {
  posts: PostApi[]
  total: number
}

export const searchPostsApi = async ({ query }: SearchPostsReq): Promise<SearchPostsRes> => {
  return fetchClient<SearchPostsRes>(`/posts/search?q=${query}`)
}
