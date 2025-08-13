import { useQuery } from "@tanstack/react-query"
import { useFetchPostsModeStore } from "./fetchMode.store"
import { useUsersQuery } from "../../../entities/user/hook"
import { USER_SEARCH } from "../constants/constant"
import { queryKeyGeneratorByMode } from "../utils/queryKeyGeneratorByMode"
import { fetchPostsByMode } from "./api"
import { joinPostsWithUsers } from "../utils/joinPostsWithUsers"
import { useMemo } from "react"

/**
 * 포스트 목록 조회
 * @returns 포스트 목록
 */
export const useFetchPostsByMode = () => {
  const { mode } = useFetchPostsModeStore()
  // key 생성
  const key = useMemo(() => queryKeyGeneratorByMode(mode), [mode])
  console.log("useFetchPost의 KEY", key)
  // 유저 목록 조회
  const users = useUsersQuery(USER_SEARCH.limit, USER_SEARCH.select)

  // 포스트 목록 조회
  const { data, isLoading, isError } = useQuery({
    queryKey: key,
    queryFn: async () => await fetchPostsByMode(mode),
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
