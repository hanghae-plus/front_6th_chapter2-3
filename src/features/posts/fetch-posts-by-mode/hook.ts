import { useQuery } from "@tanstack/react-query"
import { useFetchPostsModeStore } from "./fetchMode.store"
import { useUsersQuery } from "../../../entities/user/hook"
import { USER_SEARCH } from "../constants/constant"

import { fetchPostsByMode } from "./api"
import { joinPostsWithUsers } from "../utils/joinPostsWithUsers"
import { useMemo } from "react"
import { useUpdateURL } from "../../update-URL/useUpdateURL"
import { queryBuilderHelper } from "../../../entities/post/utils"
import { fetchPostsTest } from "../../../entities/post/api"

/**
 * 포스트 목록 조회
 * @returns 포스트 목록
 */
export const useFetchPostsByMode = () => {
  const { params } = useUpdateURL()

  const { state } = useFetchPostsModeStore()
  console.log("state", state)
  //   console.log("useFetchPost의 KEY", state, key)
  // 유저 목록 조회
  const users = useUsersQuery(USER_SEARCH.limit, USER_SEARCH.select)

  // 포스트 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: ["postsView", ...Object.values(state)],
    // queryFn: async () => await fetchPostsByMode(state),
    queryFn: async () =>
      await fetchPostsTest(
        queryBuilderHelper(state.mode, {
          limit: state.limit,
          skip: state.skip,
          sortBy: state.sortBy,
          order: state.order,
          tag: state.tag,
          q: state.q,
        }),
      ),
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
