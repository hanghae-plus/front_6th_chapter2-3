import { useQuery } from "@tanstack/react-query"
import { useFetchPostsModeStore } from "./fetchMode.store"
import { useUsersQuery } from "../../../entities/user/hook"
import { USER_SEARCH } from "../constants/constant"

import { joinPostsWithUsers } from "../utils/joinPostsWithUsers"
import { useMemo } from "react"
import { queryBuilderHelper } from "../utils/utils"
import { fetchPostsByUrl } from "../../../entities/post/api"

/**
 * 포스트 목록 조회
 * @returns 포스트 목록
 */
export const useFetchPostsByMode = () => {
  // 모드 상태
  const { state } = useFetchPostsModeStore()

  // 주소 쿼리 생성
  const queryUrl = queryBuilderHelper(state.mode, {
    limit: state.limit || 10,
    skip: state.skip || 0,
    sortBy: state.sortBy || "",
    order: state.order || "",
    tag: state.tag || "",
    q: state.q || "",
  })

  // 유저 목록 조회
  const users = useUsersQuery(USER_SEARCH.limit, USER_SEARCH.select)

  // 포스트 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["postsView", ...Object.values(state)],
    queryFn: async () => await fetchPostsByUrl(queryUrl),
    placeholderData: (prev) => prev,
  })

  // 포스트와 유저 정보를 합친다.
  const postsWithUsers = useMemo(() => {
    return joinPostsWithUsers(data?.posts ?? [], users.data?.users ?? [])
  }, [data, users])

  return {
    isLoading: isLoading || users.isLoading,
    isError: isError || users.isError,
    posts: postsWithUsers,
    total: data?.total ?? 0,
  }
}
