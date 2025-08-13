import { fetchPosts, fetchPostsByTag, searchPosts } from "../../../entities/post/api"
import { FetchPostsQueryParams } from "./fetchMode.store"

/**
 * 모드에 따라 포스트를 가져온다.
 * @param mode 모드
 * @returns 포스트 api 호출 결과
 */
export async function fetchPostsByMode(queryParamsWithMode: FetchPostsQueryParams) {
  const { mode, limit = 10, skip = 0, q, tag } = queryParamsWithMode
  if (mode === "list") return fetchPosts(limit, skip)
  if (mode === "search") return searchPosts(q || "", limit, skip)
  return fetchPostsByTag(tag || "", limit, skip)
}
