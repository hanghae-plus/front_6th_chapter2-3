import { FetchPostsMode } from "../fetch-posts-by-mode/fetchMode.store"

/**
 * 포스트 모드에 따라 쿼리키를 생성한다.
 * @param mode
 * @returns
 */
export const queryKeyGeneratorByMode = (mode: FetchPostsMode) =>
  mode.type === "list"
    ? (["postsView", "list", { limit: mode.limit, skip: mode.skip }] as const)
    : mode.type === "search"
      ? (["postsView", "search", { q: mode.q }] as const)
      : (["postsView", "tag", { tag: mode.tag }] as const)
