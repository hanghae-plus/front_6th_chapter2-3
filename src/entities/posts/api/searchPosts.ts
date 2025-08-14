import fetchClient from "../../../shared/api/fetchClient"
import { PostDTO } from "./types"

type SearchPostsReq = {
  query: string
}

type SearchPostsRes = {
  posts: PostDTO[]
  total: number
}

export const searchPostsApi = async ({ query }: SearchPostsReq): Promise<SearchPostsRes> => {
  return fetchClient<SearchPostsRes>(`/posts/search?q=${query}`)
}
