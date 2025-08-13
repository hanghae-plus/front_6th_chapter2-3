import { fetchPosts, fetchPostsByTag, searchPosts } from "../../../entities/post/api"
import { FetchPostsMode } from "./fetchMode.store"

/**
 * 모드에 따라 포스트를 가져온다.
 * @param mode 모드
 * @returns 포스트 api 호출 결과
 */
export async function fetchPostsByMode(mode: FetchPostsMode) {
  if (mode.type === "list") return fetchPosts(mode.limit, mode.skip)
  if (mode.type === "search") return searchPosts(mode.q)
  return fetchPostsByTag(mode.tag)
}
