import { PostSearchParams } from "@/entities/post/model"

// 기본 포스트 검색 파라미터
export const DEFAULT_POST_SEARCH_PARAMS: PostSearchParams = {
  skip: 0,
  limit: 10,
  search: "",
  tag: "all",
  sortBy: "none",
  order: "asc",
}

export const changePostSearchParams = (params: PostSearchParams) => {
  return {
    ...params,
    tag: params.tag === "all" ? undefined : params.tag,
    sortBy: params.sortBy === "none" ? undefined : params.sortBy,
  }
}
