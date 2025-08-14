import { useQuery } from "@tanstack/react-query"
import { userKeys } from "./useQueryKeys"
import { userApi } from "../api"

// 특정 사용자 정보 조회
export const useUserQuery = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  })
}

// 사용자 목록 조회
export const useUsersListQuery = () => {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => userApi.getUsersList(),
  })
}
